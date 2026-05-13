const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['earbuds', 'watch', 'headphones', 'tablet', 'drone', 'smart-home', 'keyboard', 'monitor', 'gaming']
  },
  loyaltyPoints: {
    type: Number,
    default: function () {
      // 1 point per ₹100
      return Math.floor(this.price / 100);
    }
  },
  stock: {
    type: Number,
    default: 50
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
