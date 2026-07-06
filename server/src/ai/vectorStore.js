// server/src/ai/vectorStore.js
const prisma = require('../lib/prisma');
const embeddings = require('./embeddings');
// Search for similar products using cosine similarity
const searchSimilarProducts = async (query, topK = 3) => {
  // Embed the query
  let queryVector = await embeddings.embedQuery(query);
  queryVector = queryVector.slice(0, 768);

  // Raw SQL cosine similarity search using pgvector
  const results = await prisma.$queryRaw`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.purity,
      p.weight,
      p.metal,
      p.tag,
      p.slug,
      pe.content,
      1 - (pe.embedding <=> ${JSON.stringify(queryVector)}::vector) as similarity
    FROM "ProductEmbedding" pe
    JOIN "Product" p ON p.id = pe."productId"
    WHERE p."isActive" = true
    ORDER BY pe.embedding <=> ${JSON.stringify(queryVector)}::vector
    LIMIT ${topK}
  `;

  return results;
};

module.exports = { searchSimilarProducts };