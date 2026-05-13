const User = require('../models/User');
const RedeemedReward = require('../models/Reward');
const { sendRewardRedeemedEmail } = require('../utils/emailService');

// All available rewards (same as your original project)
const REWARDS_CATALOG = [
  { id: 1, name: '₹50 Discount Voucher', points: 100, type: 'voucher', value: 50, icon: 'fa-ticket-alt' },
  { id: 2, name: '₹100 Discount Voucher', points: 200, type: 'voucher', value: 100, icon: 'fa-ticket-alt' },
  { id: 3, name: '₹250 Discount Voucher', points: 500, type: 'voucher', value: 250, icon: 'fa-ticket-alt' },
  { id: 4, name: '₹500 Discount Voucher', points: 1000, type: 'voucher', value: 500, icon: 'fa-ticket-alt' },
  { id: 5, name: 'Free Shipping (1 Month)', points: 150, type: 'benefit', icon: 'fa-shipping-fast' },
  { id: 6, name: 'Early Access to Sales', points: 300, type: 'benefit', icon: 'fa-clock' },
  { id: 7, name: 'Echo Premium Membership', points: 2000, type: 'membership', icon: 'fa-crown' },
  { id: 8, name: 'Mystery Gift Box', points: 800, type: 'gift', icon: 'fa-gift' }
];

// @desc    Get all rewards catalog
// @route   GET /api/rewards
// @access  Private
const getRewards = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      userPoints: user.loyaltyPoints,
      rewards: REWARDS_CATALOG
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Redeem a reward
// @route   POST /api/rewards/redeem
// @access  Private
const redeemReward = async (req, res) => {
  try {
    const { rewardId } = req.body;

    // Find reward in catalog
    const reward = REWARDS_CATALOG.find(r => r.id === rewardId);
    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    // Check user points
    const user = await User.findById(req.user._id);
    if (user.loyaltyPoints < reward.points) {
      return res.status(400).json({
        success: false,
        message: `Not enough points! You need ${reward.points} points but have ${user.loyaltyPoints}`
      });
    }

    // Deduct points
    user.loyaltyPoints -= reward.points;
    await user.save();

    // Save redeemed reward
    const redeemedReward = await RedeemedReward.create({
      user: user._id,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsCost: reward.points,
      type: reward.type
    });

    // Send reward email (async, non-blocking)
    sendRewardRedeemedEmail(user, {
      name: redeemedReward.rewardName,
      points: redeemedReward.pointsCost,
      type: redeemedReward.type,
      voucherCode: redeemedReward.voucherCode
    }).catch(err => console.error('Reward email error:', err));

    res.json({
      success: true,
      message: `🎉 ${reward.name} redeemed successfully!`,
      remainingPoints: user.loyaltyPoints,
      reward: {
        name: redeemedReward.rewardName,
        type: redeemedReward.type,
        voucherCode: redeemedReward.voucherCode || null,
        redeemedAt: redeemedReward.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's redeemed rewards
// @route   GET /api/rewards/my-rewards
// @access  Private
const getMyRewards = async (req, res) => {
  try {
    const rewards = await RedeemedReward.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, rewards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getRewards, redeemReward, getMyRewards };
