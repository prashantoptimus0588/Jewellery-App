// server/src/ai/ragChain.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { searchSimilarProducts } = require('./vectorStore');
const { getHistory, saveHistory } = require('./chatMemory');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Use the stable model, not the -preview variant. Preview/experimental
// models carry much tighter free-tier daily quotas (we hit a 20 req/day
// cap on gemini-3-flash-preview vs ~1,500/day on the stable release).
// const model = genAI.getGenerativeModel({ model: 'gemini-3-flash' });
// const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

const SYSTEM_PROMPT = `You are a helpful and friendly jewellery assistant for Vikas Jewellers, a premium Indian jewellery store. 

Your role:
- Help customers find the perfect jewellery based on their needs, budget, and occasion
- Suggest products from the relevant context
- Answer questions about gold purity, diamond quality, jewellery care, and fashion trends
- Be warm, knowledgeable, and conversational
- You can respond in English or Hinglish (mix of Hindi and English) based on how the user writes
- Always mention prices in Indian Rupees (₹)
- If no relevant products are found, suggest visiting the store or browsing categories
- Never make up products that aren't in the context
- Keep responses concise and helpful

Store details:
- Location: Jaipur, Rajasthan (and store branch in Kanpur, Uttar Pradesh)
- Speciality: 22K Gold, Diamond, Bridal jewellery
- Trust: BIS Hallmarked, Lifetime Exchange, Free Insured Shipping`;

const FALLBACK_MESSAGE =
  "I am having trouble processing that request right now. How else can I help you with our jewellery collection?";

const BUSY_MESSAGE =
  "We're getting a lot of questions right now — please try again in a moment 🙏";

const buildPrompt = (userMessage, relevantProducts, chatHistory) => {
  const productContext = relevantProducts.length > 0
    ? `\nRelevant products from our catalog:\n${relevantProducts.map((p, i) => `
${i + 1}. ${p.name}
   Price: ₹${Number(p.price).toLocaleString('en-IN')}
   ${p.metal ? `Metal: ${p.metal.replace('_', ' ')}` : ''}
   ${p.purity ? `Purity: ${p.purity}` : ''}
   ${p.weight ? `Weight: ${p.weight}` : ''}
   ${p.tag ? `Tag: ${p.tag}` : ''}
   Description: ${p.description}
   Link: /product/${p.slug}
`).join('\n')}`
    : '\nNo specific products found for this query. Suggest browsing categories.';

  const historyText = chatHistory.length > 0
    ? `\nPrevious conversation:\n${chatHistory.map(m => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`).join('\n')}`
    : '';

  return `${SYSTEM_PROMPT}
${productContext}
${historyText}

Customer: ${userMessage}
Assistant:`;
};

const chat = async (sessionId, userMessage) => {
  const t0 = performance.now();

  // History (Redis) and product search (embedding + pgvector) are
  // independent of each other — run them in parallel instead of
  // sequentially. If the product search fails for any reason, fall back
  // to an empty list rather than failing the whole chat.
  const [history, rawProducts] = await Promise.all([
    getHistory(sessionId),
    searchSimilarProducts(userMessage).catch((err) => {
      console.error('[ragChain] searchSimilarProducts failed:', err.message);
      return [];
    }),
  ]);

  const relevantProducts = rawProducts.filter((p) => Number(p.similarity) >= 0.65);
  const prompt = buildPrompt(userMessage, relevantProducts, history);

  const mappedProducts = relevantProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    slug: p.slug,
    image: p.image || null,
    similarity: Number(p.similarity),
  }));

  let response;
  try {
    const genStart = performance.now();
    const result = await model.generateContent(prompt);
    console.log(`[timing] gemini generateContent: ${(performance.now() - genStart).toFixed(0)}ms`);

    response = result.response && typeof result.response.text === 'function'
      ? result.response.text()
      : FALLBACK_MESSAGE;
  } catch (err) {
    const isRateLimited = err.message?.includes('429') || err.message?.includes('Too Many Requests');
    console.error('[ragChain] generateContent failed:', err.message);
    response = isRateLimited ? BUSY_MESSAGE : FALLBACK_MESSAGE;
  }

  // Don't make the customer wait on the Redis write — they already have
  // their answer. Save history in the background and just log failures.
  const updatedHistory = [
    ...history,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: response },
  ];
  saveHistory(sessionId, updatedHistory).catch((err) =>
    console.error('[ragChain] saveHistory failed:', err.message)
  );

  console.log(`[timing] TOTAL chat(): ${(performance.now() - t0).toFixed(0)}ms`);

  return { response, products: mappedProducts };
};

module.exports = { chat };