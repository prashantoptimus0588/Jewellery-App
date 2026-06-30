const prisma = require('../lib/prisma');

// GET /api/products?category=slug&sub=slug
const getProducts = async (req, res) => {
  const { category, sub } = req.query;

  const where = {
    isActive: true,
  };

  if (sub) {
    where.category = { slug: sub };
  } else if (category) {
    where.category = {
      OR: [{ slug: category }, { parent: { slug: category } }],
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: { images: true, category: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ products });
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true },
  });

  if (!product) return res.status(404).json({ error: 'Product not found' });

  res.json({ product });
};

module.exports = { getProducts, getProductById };