// server/src/controllers/adminProductController.js
const prisma = require('../lib/prisma');
const cloudinary = require('../config/cloudinary');

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// GET /api/admin/products — paginated, includes inactive
const getAdminProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(category && { categoryId: category }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { images: { orderBy: { position: 'asc' } }, category: true },
        orderBy: { createdAt: 'desc' },
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

// POST /api/admin/products
const createProduct = async (req, res) => {
  try {
    const { name, description, price, purity, weight, metal, stock, tag, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ error: 'name, price, and categoryId are required' });
    }

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(price),
        purity,
        weight,
        metal: metal || null,
        stock: stock != null ? parseInt(stock) : 1,
        tag,
        categoryId,
        images: req.files?.length
          ? { create: req.files.map((f, i) => ({ url: f.path, position: i })) }
          : undefined,
      },
      include: { images: true },
    });

    res.status(201).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// PUT /api/admin/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, purity, weight, metal, stock, tag, categoryId, isActive } = req.body;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let slug = product.slug;
    if (name && name !== product.name) {
      slug = slugify(name);
      const clash = await prisma.product.findFirst({ where: { slug, NOT: { id } } });
      if (clash) slug = `${slug}-${Date.now().toString(36)}`;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseInt(price) }),
        ...(purity !== undefined && { purity }),
        ...(weight !== undefined && { weight }),
        ...(metal !== undefined && { metal }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(tag !== undefined && { tag }),
        ...(categoryId && { categoryId }),
        ...(isActive !== undefined && { isActive }),
        // new images get appended after existing ones
        ...(req.files?.length && {
          images: {
            create: req.files.map((f, i) => ({ url: f.path, position: product.images?.length + i || i })),
          },
        }),
      },
      include: { images: { orderBy: { position: 'asc' } } },
    });

    res.json({ product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// PATCH /api/admin/products/:id/stock — quick stock-only update
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (stock == null || stock < 0) {
      return res.status(400).json({ error: 'Valid stock value required' });
    }
    const product = await prisma.product.update({
      where: { id },
      data: { stock: parseInt(stock) },
    });
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

// DELETE /api/admin/products/:id — soft delete
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    res.json({ message: 'Product deactivated', product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// DELETE /api/admin/products/:id/images/:imageId — remove a single image
const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ error: 'Image not found' });

    // extract public_id from the Cloudinary URL to also delete it there
    const publicId = image.url.split('/upload/')[1]?.split('.')[0];
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch((e) => console.error('Cloudinary delete failed:', e));
    }

    await prisma.productImage.delete({ where: { id: imageId } });
    res.json({ message: 'Image removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = {
  getAdminProducts,
  createProduct,
  updateProduct,
  updateStock,
  deleteProduct,
  deleteProductImage,
};