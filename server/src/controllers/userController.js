// server/src/controllers/userController.js
const prisma = require('../lib/prisma');

// GET /api/user/wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          include: { images: { orderBy: { position: 'asc' }, take: 1 } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

// POST /api/user/wishlist/:productId
const addToWishlist = async (req, res) => {
  try {
    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: req.params.productId,
        },
      },
      update: {},
      create: {
        userId: req.user.id,
        productId: req.params.productId,
      },
    });
    res.json({ item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

// DELETE /api/user/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId: req.user.id,
        productId: req.params.productId,
      },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

// PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone },
    });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, updateProfile };