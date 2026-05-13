const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, simulateOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/create-razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/simulate', protect, simulateOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);

module.exports = router;
