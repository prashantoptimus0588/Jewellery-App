// server/prisma/seed.js
require('dotenv').config({ path: '../.env' });
const prisma = require('../src/lib/prisma');

async function main() {
  console.log('Seeding...');

  // ---------------------------------------------------------
  // CATEGORIES
  // ---------------------------------------------------------
  const categoryData = [
    {
      name: 'All Jewellery', slug: 'all-jewellery',
      children: [
        { name: 'New Arrivals', slug: 'new-arrivals' },
        { name: 'Best Sellers', slug: 'best-sellers' },
        { name: 'Gift Finder', slug: 'gift-finder' },
      ],
    },
    {
      name: 'Gold', slug: 'gold',
      children: [
        { name: 'Gold Rings', slug: 'gold-rings' },
        { name: 'Gold Chains', slug: 'gold-chains' },
        { name: 'Gold Bangles', slug: 'gold-bangles' },
        { name: 'Gold Earrings', slug: 'gold-earrings' },
      ],
    },
    {
      name: 'Diamond', slug: 'diamond',
      children: [
        { name: 'Diamond Rings', slug: 'diamond-rings' },
        { name: 'Diamond Earrings', slug: 'diamond-earrings' },
        { name: 'Diamond Pendants', slug: 'diamond-pendants' },
      ],
    },
    {
      name: 'Earrings', slug: 'earrings',
      children: [
        { name: 'Studs', slug: 'studs' },
        { name: 'Hoops', slug: 'hoops' },
        { name: 'Jhumkas', slug: 'jhumkas' },
        { name: 'Drop Earrings', slug: 'drop-earrings' },
      ],
    },
    {
      name: 'Rings', slug: 'rings',
      children: [
        { name: 'Engagement Rings', slug: 'engagement-rings' },
        { name: 'Couple Rings', slug: 'couple-rings' },
        { name: 'Cocktail Rings', slug: 'cocktail-rings' },
      ],
    },
    {
      name: 'Daily Wear', slug: 'daily-wear',
      children: [
        { name: 'Lightweight Gold', slug: 'lightweight-gold' },
        { name: 'Minimal Studs', slug: 'minimal-studs' },
        { name: 'Everyday Chains', slug: 'everyday-chains' },
      ],
    },
    {
      name: 'Wedding', slug: 'wedding',
      children: [
        { name: 'Bridal Sets', slug: 'bridal-sets' },
        { name: 'Mangalsutra', slug: 'mangalsutra' },
        { name: 'Wedding Bands', slug: 'wedding-bands' },
      ],
    },
    {
      name: 'Gifting', slug: 'gifting',
      children: [
        { name: 'Under ₹10,000', slug: 'under-10000' },
        { name: 'Anniversary Gifts', slug: 'anniversary-gifts' },
        { name: 'Gift Cards', slug: 'gift-cards' },
      ],
    },
  ];

  const categoryMap = {}; // slug -> id

  for (const cat of categoryData) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    categoryMap[cat.slug] = parent.id;

    for (const child of cat.children) {
      const sub = await prisma.category.upsert({
        where: { slug: child.slug },
        update: { name: child.name },
        create: { name: child.name, slug: child.slug, parentId: parent.id },
      });
      categoryMap[child.slug] = sub.id;
    }
  }

  console.log(`✓ Categories seeded (${Object.keys(categoryMap).length} rows)`);

  // ---------------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------------
  const products = [
    {
      name: 'Bloom Bud Gold Ring',
      slug: 'bloom-bud-gold-ring',
      description: 'Inspired by the first bloom of spring, this exquisite ring is crafted in 22 Karat Yellow Gold. Intricate petal details surround a brilliant center, making it a perfect statement piece for special occasions.',
      price: 66174,
      purity: '22 Karat',
      weight: '4.50 g',
      metal: 'YELLOW_GOLD',
      stock: 5,
      tag: 'Best Seller',
      categorySlug: 'gold-rings',
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1603561591411-07eea52f1e26?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Verdant Bloom Gold Ring',
      slug: 'verdant-bloom-gold-ring',
      description: 'A graceful ring featuring a verdant floral pattern in 22 Karat Yellow Gold. Lightweight and elegant, designed for everyday luxury.',
      price: 63350,
      purity: '22 Karat',
      weight: '4.20 g',
      metal: 'YELLOW_GOLD',
      stock: 1,
      tag: 'Only 1 left!',
      categorySlug: 'gold-rings',
      images: [
        'https://images.unsplash.com/photo-1603561591411-07eea52f1e26?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Radiant Diamond Necklace',
      slug: 'radiant-diamond-necklace',
      description: 'A stunning solitaire diamond pendant set in 18 Karat White Gold. The precision-cut diamond catches light beautifully from every angle.',
      price: 145000,
      purity: '18 Karat',
      weight: '6.80 g',
      metal: 'WHITE_GOLD',
      stock: 3,
      tag: null,
      categorySlug: 'diamond-pendants',
      images: [
        'https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Classic Gold Bangles',
      slug: 'classic-gold-bangles',
      description: 'A timeless pair of 22 Karat Yellow Gold bangles with a smooth polished finish. Perfect for daily wear or gifting.',
      price: 89500,
      purity: '22 Karat',
      weight: '18.00 g',
      metal: 'YELLOW_GOLD',
      stock: 8,
      tag: 'New Arrival',
      categorySlug: 'gold-bangles',
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Solitaire Diamond Studs',
      slug: 'solitaire-diamond-studs',
      description: 'Classic round brilliant diamond studs set in 18 Karat White Gold four-prong settings. A wardrobe essential that elevates any look.',
      price: 112000,
      purity: '18 Karat',
      weight: '2.10 g',
      metal: 'WHITE_GOLD',
      stock: 6,
      tag: null,
      categorySlug: 'diamond-earrings',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Imperial Rose Gold Ring',
      slug: 'imperial-rose-gold-ring',
      description: 'A bold cocktail ring in 18 Karat Rose Gold with a unique twisted band design. Makes a striking statement for evening occasions.',
      price: 78200,
      purity: '18 Karat',
      weight: '5.30 g',
      metal: 'ROSE_GOLD',
      stock: 4,
      tag: null,
      categorySlug: 'cocktail-rings',
      images: [
        'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Kundan Drop Earrings',
      slug: 'kundan-drop-earrings',
      description: 'Traditional Kundan drop earrings crafted in 22 Karat Gold with intricate meenakari work. Perfect for weddings and festive occasions.',
      price: 48200,
      purity: '22 Karat',
      weight: '8.40 g',
      metal: 'YELLOW_GOLD',
      stock: 5,
      tag: 'New Arrival',
      categorySlug: 'jhumkas',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Bridal Polki Set',
      slug: 'bridal-polki-set',
      description: 'An opulent bridal necklace and earring set featuring uncut Polki diamonds in 22 Karat Gold. Designed for the modern bride who values heritage.',
      price: 385000,
      purity: '22 Karat',
      weight: '62.00 g',
      metal: 'YELLOW_GOLD',
      stock: 2,
      tag: 'Premium',
      categorySlug: 'bridal-sets',
      images: [
        'https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Minimal Gold Chain',
      slug: 'minimal-gold-chain',
      description: 'A delicate 22 Karat Yellow Gold chain with a fine link pattern. Lightweight enough for everyday wear, elegant enough for any occasion.',
      price: 24500,
      purity: '22 Karat',
      weight: '3.20 g',
      metal: 'YELLOW_GOLD',
      stock: 12,
      tag: null,
      categorySlug: 'everyday-chains',
      images: [
        'https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=2070&auto=format&fit=crop',
      ],
    },
    {
      name: 'Diamond Aura Pendant',
      slug: 'diamond-aura-pendant',
      description: 'A halo-set diamond pendant in 18 Karat Rose Gold. The brilliant center diamond is surrounded by a sparkling ring of micro-pavé diamonds.',
      price: 124500,
      purity: '18 Karat',
      weight: '3.80 g',
      metal: 'ROSE_GOLD',
      stock: 3,
      tag: 'Best Seller',
      categorySlug: 'diamond-pendants',
      images: [
        'https://images.unsplash.com/photo-1599643478524-fb66f7ca066b?q=80&w=2070&auto=format&fit=crop',
      ],
    },
  ];

  for (const p of products) {
    const { images, categorySlug, ...productData } = p;
    const categoryId = categoryMap[categorySlug];

    if (!categoryId) {
      console.warn(`  ⚠ Category not found for slug: ${categorySlug}, skipping ${p.name}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...productData, categoryId },
      create: {
        ...productData,
        categoryId,
        images: {
          create: images.map((url, i) => ({ url, position: i })),
        },
      },
    });

    console.log(`  ✓ ${product.name}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());