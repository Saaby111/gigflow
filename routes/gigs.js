const express = require('express');
const router = express.Router();
const { 
  getGigs, 
  getGig, 
  createGig, 
  updateGig, 
  deleteGig,
  getGigBids,
  hireFreelancer
} = require('../controllers/gigController');
const { protect } = require('../middleware/auth');

router.get('/', getGigs);
router.get('/:id', getGig);
router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);


router.get('/:id/bids', protect, getGigBids);
router.put('/:gigId/hire/:bidId', protect, hireFreelancer);

module.exports = router;