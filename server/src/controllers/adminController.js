// server/src/controllers/adminController.js
const prisma = require('../lib/prisma');
const cloudinary = require('../config/cloudinary');
const embeddings = require('../ai/embeddings');


// ---- PRODUCTS ----

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: { orderBy: { position: 'asc' } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, purity, weight, metal, stock, tag, categorySlug } = req.body;
    const files = req.files;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) return res.status(400).json({ error: 'Category not found' });

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(price),
        purity: purity || null,
        weight: weight || null,
        metal: metal || null,
        stock: parseInt(stock) || 1,
        tag: tag || null,
        categoryId: category.id,
        images: {
          create: files.map((file, i) => ({
            url: file.path,
            position: i,
          })),
        },
      },
      include: { images: true },
    });

    generateEmbeddingForProduct(product, category).catch(console.error);
    res.json({ product });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

const generateEmbeddingForProduct = async (product, category) => {
  try {
    const content = `
      Product: ${product.name}
      Category: ${category?.name || ''}
      Description: ${product.description}
      Price: ₹${product.price}
      Metal: ${product.metal?.replace('_', ' ') || 'N/A'}
      Purity: ${product.purity || 'N/A'}
      Weight: ${product.weight || 'N/A'}
      Tag: ${product.tag || 'N/A'}
    `.trim();

    const vector = await embeddings.embedQuery(content);

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
    console.log(`✓ Embedding generated for: ${product.name}`);
  } catch (err) {
    console.error(`✗ Embedding failed for: ${product.name}`, err.message);
    // Don't throw — product creation should still succeed even if embedding fails
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, purity, weight, metal, stock, tag, categorySlug, isActive } = req.body;
    const files = req.files;

    const data = {
      name,
      description,
      price: parseInt(price),
      purity: purity || null,
      weight: weight || null,
      metal: metal || null,
      stock: parseInt(stock),
      tag: tag || null,
      isActive: isActive === 'true' || isActive === true,
    };

    if (categorySlug) {
      // FIX 1: Renamed variable to 'foundCategory' to avoid any naming confusion
      const foundCategory = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (foundCategory) data.categoryId = foundCategory.id;
    }

    if (name) {
      data.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const product = await prisma.product.update({
      where: { id },
      data,
      // FIX 2: Tell Prisma to fetch the category data alongside the updated product
      include: { category: true } 
    });

    // Add new images if uploaded
    if (files?.length) {
      const existingCount = await prisma.productImage.count({ where: { productId: id } });
      await prisma.productImage.createMany({
        data: files.map((file, i) => ({
          productId: id,
          url: file.path,
          position: existingCount + i,
        })),
      });
    }

    // FIX 3: Pass 'product.category' instead of just 'category'
    generateEmbeddingForProduct(product, product.category).catch(console.error);
    res.json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete images from Cloudinary
    const images = await prisma.productImage.findMany({ where: { productId: id } });
    for (const img of images) {
      const publicId = img.url.split('/').slice(-1)[0].split('.')[0];
      await cloudinary.uploader.destroy(`vikas-jewellers/${publicId}`).catch(() => {});
    }

    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ error: 'Image not found' });

    const publicId = image.url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`vikas-jewellers/${publicId}`).catch(() => {});
    await prisma.productImage.delete({ where: { id: imageId } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

// ---- ORDERS ----

const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        items: {
          include: {
            product: {
              include: { images: { orderBy: { position: 'asc' }, take: 1 } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// ---- STATS ----

const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalUsers, revenueData] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
        _sum: { totalAmount: true },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenueData._sum.totalAmount || 0,
      recentOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

module.exports = {
  getAllProducts, createProduct, updateProduct, deleteProduct, deleteProductImage,
  getAllOrders, updateOrderStatus,
  getDashboardStats,
};