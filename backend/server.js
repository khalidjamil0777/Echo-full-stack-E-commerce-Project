const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables first
dotenv.config();

// Connect to database (won't crash if not configured)
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/rewards', require('./routes/rewards'));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Echo API is running!',
    status: 'OK',
    db: require('mongoose').connection.readyState === 1 ? '✅ Connected' : '⚠️ Not connected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Echo Backend running on port ${PORT}`);
  console.log(`📡 http://localhost:${PORT}`);
});
