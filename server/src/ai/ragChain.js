// server/src/ai/ragChain.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { searchSimilarProducts } = require('./vectorStore');
const { getHistory, saveHistory } = require('./chatMemory');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
// const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

const SYSTEM_PROMPT = `You are a helpful and friendly jewellery assistant for Vikas Jewellers, a premium Indian jewellery store based in Jaipur. 

Your role:
- Help customers find the perfect jewellery based on their needs, budget, and occasion
- Suggest products from the retrieved context
- Answer questions about gold purity, diamond quality, jewellery care, and fashion trends
- Be warm, knowledgeable, and conversational
- You can respond in English or Hinglish (mix of Hindi and English) based on how the user writes
- Always mention prices in Indian Rupees (₹)
- If no relevant products are found, suggest visiting the store or browsing categories
- Never make up products that aren't in the context
- Keep responses concise and helpful

Store details:
- Location: Kanpur, Uttar Pradesh
- Speciality: 22K Gold, Diamond, Bridal jewellery
- Trust: BIS Hallmarked, Lifetime Exchange, Free Insured Shipping`;

const buildPrompt = (userMessage, retrievedProducts, chatHistory) => {
  // Format retrieved products as context
  const productContext = retrievedProducts.length > 0
    ? `\nRelevant products from our catalog:\n${retrievedProducts.map((p, i) => `
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

  // Format chat history
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
  // 1. Get chat history from Redis
  const history = await getHistory(sessionId);

  // 2. Search for relevant products
  const retrievedProducts = await searchSimilarProducts(userMessage, 3);

  // 3. Build prompt
  const prompt = buildPrompt(userMessage, retrievedProducts, history);

  // 4. Generate response
  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // 5. Update history with sliding window
  const updatedHistory = [
    ...history,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: response },
  ];
  await saveHistory(sessionId, updatedHistory);

  // 6. Return response + retrieved products for frontend cards
  return {
    response,
    products: retrievedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      slug: p.slug,
      similarity: Number(p.similarity),
    })),
  };
};

module.exports = { chat };