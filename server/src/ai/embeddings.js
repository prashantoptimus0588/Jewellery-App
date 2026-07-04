// server/src/ai/embeddings.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

const embeddings = {
  embedQuery: async (text) => {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values.slice(0, 768);
  },
  embedDocuments: async (texts) => {
    const results = await Promise.all(texts.map((t) => embeddingModel.embedContent(t)));
    return results.map((r) => r.embedding.values.slice(0, 768));
  },
};

module.exports = embeddings;