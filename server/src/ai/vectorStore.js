// server/src/ai/vectorStore.js
const prisma = require("../lib/prisma");
const embeddings = require("./embeddings");

const searchSimilarProducts = async (query, topK = 3) => {
  const tEmbed = performance.now();
  let queryVector = await embeddings.embedQuery(query);
  queryVector = queryVector.slice(0, 768);
  console.log(`[timing] embed_query: ${(performance.now() - tEmbed).toFixed(0)}ms`);

  const tQuery = performance.now();
  const results = await prisma.$queryRaw`
  SELECT 
    p.id, p.name, p.description, p.price, p.purity, p.weight, p.metal, p.tag, p.slug,
    pe.content,
    (SELECT url FROM "ProductImage" WHERE "productId" = p.id ORDER BY position ASC LIMIT 1) as image,
    1 - (pe.embedding <=> ${JSON.stringify(queryVector)}::vector) as similarity
    FROM "ProductEmbedding" pe
    JOIN "Product" p ON p.id = pe."productId"
    WHERE p."isActive" = true
    ORDER BY pe.embedding <=> ${JSON.stringify(queryVector)}::vector
    LIMIT ${topK}
  `;
  console.log(`[timing] pgvector_query: ${(performance.now() - tQuery).toFixed(0)}ms`);

  return results;
};

module.exports = { searchSimilarProducts };