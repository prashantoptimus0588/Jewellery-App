// server/src/controllers/orderController.js
const prisma = require('../lib/prisma');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/create-razorpay-order
const createRazorpayOrder = async (req, res) => {
  try {
    const { items, addressId } = req.body;
    if (!items?.length || !addressId) {
      return res.status(400).json({ error: 'items and addressId are required' });
    }

    // Fetch real prices from DB — never trust client-sent prices
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let totalAmount = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
      totalAmount += product.price * item.quantity;
    }

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `vj_${Date.now()}`,
    });

    // Create pending order in DB
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        addressId,
        totalAmount,
        status: 'PENDING',
        paymentId: razorpayOrder.id,
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              name: product.name,
              price: product.price,
              size: item.size || null,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    res.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// POST /api/orders/verify-payment
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Update order status to PAID
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paymentId: razorpayPaymentId,
        paymentMethod: 'RAZORPAY',
      },
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { orderBy: { position: 'asc' }, take: 1 } },
            },
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// POST /api/orders/address
const saveAddress = async (req, res) => {
  try {
    const { fullName, phone, line1, line2, city, state, pincode, label, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName, phone, line1, line2, city, state, pincode,
        label: label || 'Home',
        isDefault: isDefault || false,
      },
    });

    res.json({ address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save address' });
  }
};

// GET /api/orders/addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { isDefault: 'desc' },
    });
    res.json({ addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

module.exports = { createRazorpayOrder, verifyPayment, getOrders, saveAddress, getAddresses };