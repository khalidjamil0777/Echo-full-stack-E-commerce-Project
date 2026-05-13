const mongoose = require('mongoose');

const redeemedRewardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rewardId: {
    type: Number,
    required: true
  },
  rewardName: {
    type: String,
    required: true
  },
  pointsCost: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['voucher', 'benefit', 'membership', 'gift']
  },
  voucherCode: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Generate voucher code for discount vouchers
redeemedRewardSchema.pre('save', function (next) {
  if (this.type === 'voucher' && !this.voucherCode) {
    this.voucherCode = `ECHO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('RedeemedReward', redeemedRewardSchema);
