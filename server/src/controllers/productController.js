// server/src/controllers/productController.js
const prisma = require('../lib/prisma');

// GET /api/products?category=slug&sub=slug&page=1&limit=12
const getProducts = async (req, res) => {
  try {
    const { category, sub, page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let categoryFilter = {};

    if (sub) {
      const subCat = await prisma.category.findUnique({ where: { slug: sub } });
      if (subCat) categoryFilter = { categoryId: subCat.id };
    } else if (category) {
      // include parent + all its children
      const parent = await prisma.category.findUnique({
        where: { slug: category },
        include: { children: true },
      });
      if (parent) {
        const ids = [parent.id, ...parent.children.map((c) => c.id)];
        categoryFilter = { categoryId: { in: ids } };
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, ...categoryFilter },
        include: { images: { orderBy: { position: 'asc' } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({
        where: { isActive: true, ...categoryFilter },
      }),
    ]);

    res.json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// GET /api/products/:slug
const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        category: { include: { parent: true } },
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

module.exports = { getProducts, getProductById };