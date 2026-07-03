const prisma = require('../lib/prisma');

const getProducts = async (req, res) => {
  try {
    const { category, sub, page = 1, limit = 12, minPrice, maxPrice, metals, sort, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let categoryFilter = {};
    if (sub) {
      const subCat = await prisma.category.findUnique({ where: { slug: sub } });
      if (subCat) categoryFilter = { categoryId: subCat.id };
    } else if (category) {
      const parent = await prisma.category.findUnique({
        where: { slug: category },
        include: { children: true },
      });
      if (parent) {
        const ids = [parent.id, ...parent.children.map((c) => c.id)];
        categoryFilter = { categoryId: { in: ids } };
      }
    }

    let priceFilter = {};
    if (minPrice != null || maxPrice != null) {
      priceFilter.price = {};
      if (minPrice != null) priceFilter.price.gte = parseInt(minPrice);
      if (maxPrice != null) priceFilter.price.lte = parseInt(maxPrice);
    }

    let metalFilter = {};
    if (metals) {
      const metalList = metals.split(',').map((m) => m.trim().toUpperCase().replace(' ', '_'));
      metalFilter = { metal: { in: metalList } };
    }

    // Search filter
    let searchFilter = {};
    if (search) {
      const metalMap = {
        'yellow gold': 'YELLOW_GOLD',
        'rose gold': 'ROSE_GOLD',
        'white gold': 'WHITE_GOLD',
        'platinum': 'PLATINUM',
      };
      const metalValue = metalMap[search.toLowerCase().trim()];
      searchFilter = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { tag: { contains: search, mode: 'insensitive' } },
          { purity: { contains: search, mode: 'insensitive' } },
          ...(metalValue ? [{ metal: metalValue }] : []),
        ],
      };
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const where = {
      isActive: true,
      ...categoryFilter,
      ...priceFilter,
      ...metalFilter,
      ...searchFilter,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { position: 'asc' } } },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getProductBySlug = async (req, res) => {
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

module.exports = { getProducts, getProductBySlug };

// server/src/controllers/productController.js
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) return res.json({ products: [] });

    // Map common search terms to metal enum values
    const metalMap = {
      'yellow gold': 'YELLOW_GOLD',
      'rose gold': 'ROSE_GOLD',
      'white gold': 'WHITE_GOLD',
      'platinum': 'PLATINUM',
    };
    const metalValue = metalMap[q.toLowerCase().trim()];

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { tag: { contains: q, mode: 'insensitive' } },
          { purity: { contains: q, mode: 'insensitive' } },
          ...(metalValue ? [{ metal: metalValue }] : []),
        ],
      },
      include: { images: { orderBy: { position: 'asc' }, take: 1 } },
      take: 6,
    });

    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
};
module.exports = { getProducts, getProductBySlug, searchProducts };