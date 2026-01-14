const express = require('express');
const router = express.Router();
const { 
  createBid, 
  getMyBids, 
  updateBid, 
  deleteBid 
} = require('../controllers/bidController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBid);
router.get('/my-bids', protect, getMyBids);
router.put('/:id', protect, updateBid);
router.delete('/:id', protect, deleteBid);

module.exports = router;