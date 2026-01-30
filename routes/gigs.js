const express = require('express');
const router = express.Router();
const {
  getAllGigs,
  getGig,
  getMyGigs,
  getOpenGigs,  
  createGig,
  updateGig,
  deleteGig,
  hireFreelancer
} = require('../controllers/gigController');
const { protect } = require('../middleware/auth');

router.get('/', getAllGigs);           
router.get('/open', getOpenGigs);      
router.get('/my-gigs', protect, getMyGigs); 


router.get('/:id', getGig);            

router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);
router.post('/:gigId/hire/:bidId', protect, hireFreelancer);

module.exports = router;