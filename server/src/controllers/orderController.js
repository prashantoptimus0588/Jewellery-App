// server/src/controllers/orderController.js
const prisma = require('../lib/prisma');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// How long a user can hold reserved stock while paying
const RESERVATION_MINUTES = 15;

class OutOfStockError extends Error {
  constructor(productName) {
    super('OUT_OF_STOCK');
    this.productName = productName;
  }
}

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

// Atomically take `quantity` units. Postgres row-locks the product row for the
// UPDATE, so if two users race for the last piece, the second one's WHERE
// (stock >= quantity) fails after the first commits -> count === 0.
async function reserveStock(tx, items, nameLookup) {
  // Always lock products in the same order to avoid deadlocks between
  // two orders that contain the same products.
  const sorted = [...items].sort((a, b) => a.productId.localeCompare(b.productId));

  for (const item of sorted) {
    const { count } = await tx.product.updateMany({
      where: { id: item.productId, isActive: true, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    });
    if (count === 0) throw new OutOfStockError(nameLookup(item.productId));
  }
}

// Put stock back for a PENDING order and cancel it.
// Safe to call many times: only the call that flips PENDING -> CANCELLED
// restores stock, so stock can never be restored twice.
async function releaseOrderStock(orderId) {
  await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'CANCELLED' },
    });
    if (count === 0) return; // already paid / cancelled / expired

    const items = await tx.orderItem.findMany({ where: { orderId } });
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }
  });
}

// Release every PENDING order whose reservation window has passed.
const expireStaleOrders = async () => {
  const stale = await prisma.order.findMany({
    where: { status: 'PENDING', expiresAt: { lt: new Date() } },
    select: { id: true },
  });
  for (const { id } of stale) {
    await releaseOrderStock(id);
  }
};

// ---------------------------------------------------------
// POST /api/orders/create-razorpay-order
// ---------------------------------------------------------
const createRazorpayOrder = async (req, res) => {
  try {
    const { items, addressId } = req.body;
    if (!Array.isArray(items) || !items.length || !addressId) {
      return res.status(400).json({ error: 'items and addressId are required' });
    }
    for (const i of items) {
      if (!i.productId || !Number.isInteger(i.quantity) || i.quantity < 1) {
        return res.status(400).json({ error: 'Invalid item or quantity' });
      }
    }

    // Free up stock from abandoned checkouts first (the server may have been
    // asleep on Render, so the interval job might not have run).
    await expireStaleOrders();

    // Fetch real prices from DB — never trust client-sent prices
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, isActive: true },
    });

    let totalAmount = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });
      totalAmount += product.price * item.quantity;
    }

    const nameOf = (id) => products.find((p) => p.id === id)?.name || 'This item';

    // STEP 1: reserve stock + create PENDING order in ONE transaction.
    // If any item is out of stock, everything rolls back.
    const order = await prisma.$transaction(async (tx) => {
      await reserveStock(tx, items, nameOf);

      return tx.order.create({
        data: {
          userId: req.user.id,
          addressId,
          totalAmount,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000),
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
    });

    // STEP 2: call Razorpay OUTSIDE the DB transaction (network calls inside
    // a transaction hold locks and can time out). If it fails, give stock back.
    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // paise
        currency: 'INR',
        receipt: `vj_${Date.now()}`,
      });
    } catch (rzpErr) {
      await releaseOrderStock(order.id);
      throw rzpErr;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: razorpayOrder.id },
    });

    res.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      expiresAt: order.expiresAt,
    });
  } catch (err) {
    if (err instanceof OutOfStockError) {
      return res.status(409).json({
        code: 'OUT_OF_STOCK',
        error: `Sorry, "${err.productName}" just went out of stock.`,
      });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// ---------------------------------------------------------
// POST /api/orders/verify-payment
// ---------------------------------------------------------
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Only the owner can verify their own order
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.id },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Idempotent: verifying twice must not do anything twice
    if (order.status === 'PAID') return res.json({ success: true, order });

    // The Razorpay order in the request must be the one we created for THIS order
    // (otherwise a signature from a cheap order could be replayed on an expensive one)
    if (order.paymentId !== razorpayOrderId) {
      return res.status(400).json({ error: 'Order mismatch' });
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    const paidData = {
      status: 'PAID',
      paymentId: razorpayPaymentId,
      paymentMethod: 'RAZORPAY',
      expiresAt: null,
    };

    // Normal path: stock is already reserved, just flip PENDING -> PAID.
    const { count } = await prisma.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: paidData,
    });

    // Edge case: user paid AFTER the reservation expired and was released.
    // Try to re-reserve; if the item is gone, refund automatically.
    if (count === 0) {
      const nameOf = (id) => order.items.find((i) => i.productId === id)?.name || 'This item';
      try {
        await prisma.$transaction(async (tx) => {
          const flip = await tx.order.updateMany({
            where: { id: orderId, status: 'CANCELLED' },
            data: paidData,
          });
          if (flip.count === 0) throw new Error('UNEXPECTED_ORDER_STATE');
          await reserveStock(tx, order.items, nameOf);
        });
      } catch (e) {
        if (e instanceof OutOfStockError) {
          await razorpay.payments.refund(razorpayPaymentId, {}); // full refund
          await prisma.order.update({
            where: { id: orderId },
            data: { status: 'REFUNDED', paymentId: razorpayPaymentId },
          });
          return res.status(409).json({
            code: 'REFUNDED',
            error: 'Your payment came in after the item sold out. A full refund has been initiated.',
          });
        }
        throw e;
      }
    }

    const updated = await prisma.order.findUnique({ where: { id: orderId } });
    res.json({ success: true, order: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// ---------------------------------------------------------
// POST /api/orders/cancel   (call when user closes the Razorpay popup)
// ---------------------------------------------------------
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user.id },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await releaseOrderStock(orderId); // no-op unless still PENDING
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel order' });
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

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  cancelOrder,
  expireStaleOrders,
  getOrders,
  saveAddress,
  getAddresses,
};