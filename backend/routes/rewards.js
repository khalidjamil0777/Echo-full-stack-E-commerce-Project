const express = require('express');
const router = express.Router();
const { getRewards, redeemReward, getMyRewards } = require('../controllers/rewardController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRewards);
router.post('/redeem', protect, redeemReward);
router.get('/my-rewards', protect, getMyRewards);

module.exports = router;
