const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri.includes('your_username:your_password')) {
    console.warn('⚠️  MongoDB not configured. Update MONGO_URI in .env to connect.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
