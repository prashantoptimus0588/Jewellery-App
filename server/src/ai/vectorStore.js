const prisma = require("../lib/prisma");
const embeddings = require("./embeddings");
const { rewriteQuery, isVagueQuery } = require("./queryRewrite");

const runSimilarityQuery = (queryVector, topK) => prisma.$queryRaw`
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

const searchSimilarProducts = async (query, topK = 3) => {
  const wasVague = isVagueQuery(query);
  const effectiveQuery = rewriteQuery(query);
  if (wasVague) {
    console.log(`[vectorStore] vague query rewritten: "${query}" -> "${effectiveQuery}"`);
  }

  const tEmbed = performance.now();
  const queryVector = (await embeddings.embedQuery(effectiveQuery)).slice(0, 768);
  console.log(`[timing] embed_query: ${(performance.now() - tEmbed).toFixed(0)}ms`);

  // Vague queries are inherently less specific, so any single product's
  // similarity score will be lower even after rewriting. Pull a couple
  // extra candidates for this case — the caller's similarity threshold
  // still filters junk, this just widens the net before that happens.
  const effectiveTopK = wasVague ? topK + 2 : topK;

  const tQuery = performance.now();
  try {
    const results = await runSimilarityQuery(queryVector, effectiveTopK);
    console.log(`[timing] pgvector_query: ${(performance.now() - tQuery).toFixed(0)}ms`);
    return results;
  } catch (err) {
    const isColdStart = err.message?.includes("Can't reach database server");
    if (!isColdStart) throw err;

    console.warn('[vectorStore] DB unreachable, likely Neon cold start — retrying once in 3s...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const retryStart = performance.now();
    const results = await runSimilarityQuery(queryVector, effectiveTopK);
    console.log(`[timing] pgvector_query (after retry): ${(performance.now() - retryStart).toFixed(0)}ms`);
    return results;
  }
};

module.exports = { searchSimilarProducts };