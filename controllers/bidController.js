const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

exports.createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;
    
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Gig is no longer accepting bids'
      });
    }
    

    if (gig.ownerId.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }
    
    
    const existingBid = await Bid.findOne({
      gigId,
      freelancerId: req.user.id
    });
    
    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already bid on this gig'
      });
    }
    
    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price
    });
    
    res.status(201).json({
      success: true,
      data: bid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancerId: req.user.id })
      .populate({
        path: 'gigId',
        populate: {
          path: 'ownerId',
          select: 'name email'
        }
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateBid = async (req, res) => {
  try {
    let bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }
    
 
    if (bid.freelancerId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
   
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update bid that is not pending'
      });
    }
    
    bid = await Bid.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: bid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id);
    
    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }
    
  
    if (bid.freelancerId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
 
    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete bid that is not pending'
      });
    }
    
    await bid.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Bid deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};