const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('../models/Product');
const User = require('../models/User');

const products = [
  {
    name: 'Echo Buds Pro',
    description: 'Premium wireless earbuds with active noise cancellation',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    category: 'earbuds',
    loyaltyPoints: 49,
    stock: 50
  },
  {
    name: 'Echo Watch',
    description: 'Smart fitness tracker with heart rate monitoring',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'watch',
    loyaltyPoints: 129,
    stock: 30
  },
  {
    name: 'Echo Headphones',
    description: 'Over-ear headphones with immersive sound quality',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'headphones',
    loyaltyPoints: 79,
    stock: 40
  },
  {
    name: 'Echo Tablet',
    description: '10.5-inch HD tablet with stylus support and long battery life',
    price: 24999,
    image: 'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=500',
    category: 'tablet',
    loyaltyPoints: 249,
    stock: 25
  },
  {
    name: 'Echo Drone',
    description: 'AI-powered 4K camera drone with obstacle avoidance',
    price: 45999,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500',
    category: 'drone',
    loyaltyPoints: 459,
    stock: 15
  },
  {
    name: 'Echo Smart Light',
    description: 'Smart LED bulb with color control via mobile app',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    category: 'smart-home',
    loyaltyPoints: 29,
    stock: 100
  },
  {
    name: 'Echo Keyboard',
    description: 'Mechanical RGB keyboard with wireless Bluetooth support',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    category: 'keyboard',
    loyaltyPoints: 49,
    stock: 35
  },
  {
    name: 'Echo Monitor',
    description: '27-inch 2K ultra slim display with 144Hz refresh rate',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    category: 'monitor',
    loyaltyPoints: 189,
    stock: 20
  },
  {
    name: 'Echo Gaming Console',
    description: 'Next-gen 4K gaming console with ultra fast performance',
    price: 69999,
    image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500',
    category: 'gaming',
    loyaltyPoints: 699,
    stock: 10
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing products
    await Product.deleteMany();
    console.log('🗑️  Products cleared');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ 9 Products seeded successfully!');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@echo.com' });
    if (!adminExists) {
      await User.create({
        name: 'Echo Admin',
        email: 'admin@echo.com',
        password: 'admin123',
        role: 'admin',
        loyaltyPoints: 0
      });
      console.log('✅ Admin user created: admin@echo.com / admin123');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin login: admin@echo.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

seedDB();
