const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmEmail } = require('../utils/emailService');

// Lazily initialize Razorpay only when keys exist
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (
    !keyId ||
    !keySecret ||
    keyId === 'your_razorpay_key_id' ||
    keySecret === 'your_razorpay_key_secret'
  ) {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// Calculate loyalty points (1 per ₹100)
const calculatePoints = (amount) => Math.floor(amount / 100);

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay is not configured. Use /api/orders/simulate or set Razorpay keys in .env'
      });
    }

    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      subtotal += product.price * item.quantity;
    }

    const shipping = subtotal >= 2000 ? 0 : 100;
    const total = subtotal + shipping;

    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: `echo_${Date.now()}`
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      subtotal,
      shipping,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay payment and create order
// @route   POST /api/orders/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    if (
      !process.env.RAZORPAY_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET === 'your_razorpay_key_secret'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay is not configured. Payment verification is unavailable.'
      });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, items } = req.body;

    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .toString('hex');

    if (expectedSign !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    await createOrderInDB(req, res, items, razorpayPaymentId, razorpayOrderId);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate order (no payment needed)
// @route   POST /api/orders/simulate
// @access  Private
const simulateOrder = async (req, res) => {
  try {
    const { items } = req.body;
    await createOrderInDB(req, res, items, null, null);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shared helper — saves order, awards points, sends email
const createOrderInDB = async (req, res, items, paymentId, razorpayOrderId) => {
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;
    subtotal += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: item.quantity
    });
  }

  const shipping = subtotal >= 2000 ? 0 : 100;
  const total = subtotal + shipping;
  const pointsEarned = calculatePoints(total);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    subtotal,
    shipping,
    total,
    loyaltyPointsEarned: pointsEarned,
    paymentStatus: 'paid',
    paymentId: paymentId || null,
    razorpayOrderId: razorpayOrderId || null
  });

  await User.findByIdAndUpdate(req.user._id, {
    $inc: { loyaltyPoints: pointsEarned }
  });

  const updatedUser = await User.findById(req.user._id);

  sendOrderConfirmEmail(updatedUser, {
    orderId: order.orderId,
    items: orderItems,
    subtotal,
    shipping,
    total,
    pointsEarned
  }).catch(err => console.error('Order email error:', err));

  res.status(201).json({
    success: true,
    message: `Order placed! You earned ${pointsEarned} loyalty points!`,
    order: {
      orderId: order.orderId,
      total: order.total,
      pointsEarned,
      totalPoints: updatedUser.loyaltyPoints
    }
  });
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment, simulateOrder, getMyOrders, getAllOrders };
