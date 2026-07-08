// server/prisma/seed.js
// Run with: node prisma/seed.js  (adjust path to match where you place this)
//
// ASSUMPTIONS ABOUT YOUR SCHEMA (based on generateProductEmbeddings.js):
//   Product: id, name, slug, description, price (Decimal/Int), metal (enum),
//            purity (String, nullable), weight (String, nullable),
//            tag (String, nullable), isActive (Boolean), categoryId (relation)
//   Category: id, name, slug
//   ProductImage: id, productId, url, position
//
// If your actual field names/enums differ, tell me the real schema and I'll
// patch this file to match exactly instead of guessing.

require('dotenv').config({ path: '../../.env' });
const prisma = require('../src/lib/prisma');

// Matches the real Metal enum in schema.prisma exactly.
const METALS = ['YELLOW_GOLD', 'ROSE_GOLD', 'WHITE_GOLD', 'PLATINUM'];

const CATEGORIES = [
  { name: 'Rings', slug: 'rings' },
  { name: 'Necklaces', slug: 'necklaces' },
  { name: 'Earrings', slug: 'earrings' },
  { name: 'Bangles', slug: 'bangles' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Pendants', slug: 'pendants' },
  { name: 'Bridal Sets', slug: 'bridal-sets' },
  { name: 'Chains', slug: 'chains' },
];

// Real Indian jewellery vocabulary — matters for semantic search quality,
// since these are the terms customers will actually type/speak.
const STYLES = [
  'Kundan', 'Polki', 'Temple', 'Antique Finish', 'Meenakari', 'Jadau',
  'Filigree', 'Nakshi', 'Contemporary', 'Minimalist', 'Statement',
  'Floral', 'Geometric', 'Classic Solitaire', 'Layered', 'Choker Style',
];

const OCCASIONS = [
  'daily wear', 'office wear', 'festive occasions', 'weddings',
  'engagement ceremonies', 'anniversary gifting', 'casual outings',
  'traditional pujas', 'cocktail parties', 'bridal trousseau',
];

const TAGS = ['bestseller', 'new_arrival', 'trending', 'bridal', 'daily_wear', 'limited_edition'];

const WEIGHTS = ['2.5g', '4.2g', '6.8g', '8.1g', '10.5g', '12.3g', '15.7g', '18.2g', '22.4g', '28.9g'];
const PURITIES_GOLD = ['22K', '18K', '14K'];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function priceForMetal(metal, hasDiamond) {
  // Rough realistic INR ranges by metal type (base, before diamond premium).
  const ranges = {
    YELLOW_GOLD: [18000, 120000],
    ROSE_GOLD: [20000, 130000],
    WHITE_GOLD: [22000, 140000],
    PLATINUM: [40000, 180000],
  };
  const [min, max] = ranges[metal] || [20000, 100000];
  let price = min + Math.random() * (max - min);
  // Diamond-set pieces command a meaningful premium over plain metal.
  if (hasDiamond) price *= 1.6 + Math.random() * 0.8; // ~1.6x–2.4x
  return Math.round(price / 100) * 100;
}

function buildDescription({ style, categoryName, occasion, metal, hasDiamond }) {
  const metalText = metal.replace('_', ' ').toLowerCase();
  const diamondText = hasDiamond ? ' studded with brilliant-cut diamonds' : '';
  return `A ${style.toLowerCase()} inspired ${categoryName.toLowerCase().slice(0, -1)} crafted in ${metalText}${diamondText}. ` +
    `Designed for ${occasion}, this piece combines intricate detailing with everyday elegance. ` +
    `BIS Hallmarked and backed by our lifetime exchange policy.`;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function seedCategories() {
  const created = {};
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });
    created[cat.slug] = category;
  }
  return created;
}

async function seedProducts(categories, countPerCategory = 12) {
  let created = 0;

  for (const cat of CATEGORIES) {
    for (let i = 0; i < countPerCategory; i++) {
      const style = randomFrom(STYLES);
      const occasion = randomFrom(OCCASIONS);
      const metal = randomFrom(METALS);
      const hasDiamond = Math.random() < 0.4; // ~40% of pieces are diamond-set
      const tag = randomFrom(TAGS);
      const weight = randomFrom(WEIGHTS);
      // PLATINUM pieces typically aren't purity-graded like gold karats.
      const purity = metal === 'PLATINUM' ? 'PT950' : randomFrom(PURITIES_GOLD);

      const name = hasDiamond
        ? `${style} Diamond ${cat.name.slice(0, -1)}`
        : `${style} ${cat.name.slice(0, -1)}`;
      const uniqueSuffix = `${slugify(cat.slug)}-${i + 1}`;
      const slug = `${slugify(name)}-${uniqueSuffix}`;

      const description = buildDescription({ style, categoryName: cat.name, occasion, metal, hasDiamond });
      const price = priceForMetal(metal, hasDiamond);

      try {
        await prisma.product.create({
          data: {
            name,
            slug,
            description,
            price,
            metal,
            purity,
            weight,
            tag,
            isActive: true,
            categoryId: categories[cat.slug].id,
            images: {
              create: [
                {
                  url: `https://picsum.photos/seed/${slug}/600/600`,
                  position: 0,
                },
              ],
            },
          },
        });
        created++;
        console.log(`✓ Created: ${name} (${cat.name}) — ₹${price}`);
      } catch (err) {
        console.error(`✗ Failed: ${name}`, err.message);
      }
    }
  }

  return created;
}

async function main() {
  console.log('Seeding categories...');
  const categories = await seedCategories();
  console.log(`✓ ${Object.keys(categories).length} categories ready.`);

  console.log('Seeding products (8 categories × 12 = ~96 products)...');
  const total = await seedProducts(categories, 12);
  console.log(`Done. ${total} products created.`);
  console.log('\nNext step: run generateProductEmbeddings.js to embed these products.');
}

main()
  .catch((err) => {
    console.error('Seed script failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());