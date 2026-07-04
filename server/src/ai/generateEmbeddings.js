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
      // 1. Generate the raw embedding vector using the native Google SDK
      const result = await embeddings.embedContent(content);
      let vector = result.embedding.values;

      // 2. Slice the array down to exactly 768 dimensions to fit the DB schema
      vector = vector.slice(0, 768);

      // 3. Store in DB using raw SQL (pgvector)
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
  }

  console.log('Done generating embeddings.');
}

generateProductEmbeddings()
  .catch(console.error)
  .finally(() => prisma.$disconnect());