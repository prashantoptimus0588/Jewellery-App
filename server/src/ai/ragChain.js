// server/src/ai/ragChain.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { searchSimilarProducts } = require('./vectorStore');
const { getHistory, saveHistory } = require('./chatMemory');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
// const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

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

const buildPrompt = (userMessage, relevantProducts, chatHistory) => {
  // Format relevant products as context
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

  // 2. Fetch products from vector store (FIXED: Added this missing database fetch step)
  const rawProducts = await searchSimilarProducts(userMessage) || [];
  
  // Filter out low similarity results — below 0.65 means not relevant enough
  // (FIXED: Uses rawProducts array to filter into relevantProducts)
  const relevantProducts = rawProducts.filter(p => Number(p.similarity) >= 0.65);

  // 3. Build prompt
  const prompt = buildPrompt(userMessage, relevantProducts, history);

  // 4. Generate response
  const result = await model.generateContent(prompt);
  
  // (FIXED: Added safety fallback in case Gemini blocks the prompt)
  const response = result.response && typeof result.response.text === 'function' 
    ? result.response.text() 
    : "I am having trouble processing that request right now. How else can I help you with our jewellery collection?";

  // 5. Update history with sliding window
  const updatedHistory = [
    ...history,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: response },
  ];
  await saveHistory(sessionId, updatedHistory);

  // 6. Return response + relevant products for frontend cards
  return {
    response,
    products: relevantProducts.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      slug: p.slug,
      image: p.image || null,
      similarity: Number(p.similarity),
    })),
  };
};

module.exports = { chat };
