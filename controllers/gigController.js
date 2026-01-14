const Gig = require('../models/Gig');
const Bid = require('../models/Bid');


exports.getGigs = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    } else {
      query.status = 'open'; 
    }
   
    if (search) {
      query.$text = { $search: search };
    }
    
    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email');
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.createGig = async (req, res) => {
  try {
    req.body.ownerId = req.user.id;
    
    const gig = await Gig.create(req.body);
    
    res.status(201).json({
      success: true,
      data: gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
 
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    await gig.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getGigBids = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    
    if (gig.ownerId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view bids for this gig'
      });
    }
    
    const bids = await Bid.find({ gigId: req.params.id })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.hireFreelancer = async (req, res) => {
  const session = await Gig.startSession();
  session.startTransaction();
  
  try {
    const { gigId, bidId } = req.params;
    
    
    const gig = await Gig.findById(gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user.id) {
      await session.abortTransaction();
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Check if gig is still open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Gig is already assigned'
      });
    }
    

    const selectedBid = await Bid.findById(bidId).session(session);
    if (!selectedBid || selectedBid.gigId.toString() !== gigId) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Bid not found for this gig'
      });
    }
    
    gig.status = 'assigned';
    await gig.save({ session });
    
    selectedBid.status = 'hired';
    await selectedBid.save({ session });

    await Bid.updateMany(
      { 
        gigId: gigId, 
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      data: {
        gig,
        hiredBid: selectedBid
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};