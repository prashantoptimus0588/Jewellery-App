require('dotenv').config({ path: '../../.env' });
const prisma = require('../lib/prisma');
const embeddings = require('./embeddings');

async function generateProductEmbeddings() {
  console.log('Fetching products...');
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: { take: 1 }, category: true },
  });

  console.log(`Generating embeddings for ${products.length} products...`);

  for (const product of products) {
    // Build rich text content for embedding
    const content = `
      Product: ${product.name}
      Category: ${product.category?.name}
      Description: ${product.description}
      Price: ₹${product.price}
      Metal: ${product.metal?.replace('_', ' ') || 'N/A'}
      Purity: ${product.purity || 'N/A'}
      Weight: ${product.weight || 'N/A'}
      Tag: ${product.tag || 'N/A'}
    `.trim();

    try {
      // embeddings.embedQuery() already returns the sliced 768-dim vector
      // directly — no need to reach into .embedding.values or slice again.
      const vector = await embeddings.embedQuery(content);

      // Store in DB using raw SQL (pgvector)
      await prisma.$executeRaw`
        INSERT INTO "ProductEmbedding" ("id", "productId", "content", "embedding", "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid()::text,
          ${product.id},
          ${content},
          ${JSON.stringify(vector)}::vector,
          NOW(),
          NOW()
        )
        ON CONFLICT ("productId") DO UPDATE SET
          "content" = EXCLUDED."content",
          "embedding" = EXCLUDED."embedding",
          "updatedAt" = NOW()
      `;

      console.log(`✓ Embedded: ${product.name}`);
    } catch (err) {
      console.error(`✗ Failed: ${product.name}`, err.message);
    }

    // Stay under free-tier per-minute rate limits when embedding in bulk.
    // Placed outside the try/catch so it still applies even after a
    // failure — a failed call still counted against the API's rate limit.
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('Done generating embeddings.');
}

generateProductEmbeddings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());