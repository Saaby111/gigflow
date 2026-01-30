const db = require('../models');
const { Op } = require('sequelize');

exports.getMyBids = async (req, res) => {
  console.log('=== GET MY BIDS DEBUG ===');
  console.log('Freelancer ID:', req.user.id);
  
  try {
    const freelancerId = req.user.id;
    
    const bids = await db.Bid.findAll({
      where: { freelancerId },
      include: [
        {
          model: db.Gig,
          as: 'gig',
          attributes: ['id', 'title', 'description', 'budget', 'status', 'clientId']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Found ${bids.length} bids for freelancer`);
    
    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
    
  } catch (error) {
    console.error('❌ Error fetching my bids:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bids',
      error: error.message
    });
  }
};


exports.getAssignedGigs = async (req, res) => {
  console.log('=== GET ASSIGNED GIGS DEBUG ===');
  console.log('Freelancer ID:', req.user.id);
  
  try {
    const freelancerId = req.user.id;
    
    
    const gigs = await db.Gig.findAll({
      where: { 
        assignedFreelancerId: freelancerId,
        status: 'assigned'
      },
      include: [
        {
          model: db.User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    console.log(`Found ${gigs.length} assigned gigs`);
    
    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
    
  } catch (error) {
    console.error('❌ Error fetching assigned gigs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching assigned gigs',
      error: error.message
    });
  }
};


exports.getBidsByGig = async (req, res) => {
 
  
  try {
    const { gigId } = req.params;
    const userId = req.user.id;

  
    const gig = await db.Gig.findOne({
      where: { id: gigId },
      include: [{
        model: db.User,
        as: 'client',
        attributes: ['id']
      }]
    });

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.clientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Only gig owner can view bids'
      });
    }


    const bids = await db.Bid.findAll({
      where: { gigId: gigId },
      include: [{
        model: db.User,
        as: 'freelancer',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Found ${bids.length} bids for gig ${gigId}`);

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });

  } catch (error) {
    console.error('❌ Error fetching bids:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bids',
      error: error.message
    });
  }
};

exports.hireFreelancer = async (req, res) => {
  console.log('=== HIRE FREELANCER DEBUG ===');
  console.log('Bid ID:', req.params.bidId);
  console.log('User ID:', req.user.id);
  
  const transaction = await db.sequelize.transaction();
  
  try {
    const { bidId } = req.params;
    const userId = req.user.id;

    // 1. Find the bid with gig and freelancer details
    const bid = await db.Bid.findOne({
      where: { id: bidId },
      include: [
        {
          model: db.Gig,
          as: 'gig',
          attributes: ['id', 'title', 'status', 'clientId']
        },
        {
          model: db.User,
          as: 'freelancer',
          attributes: ['id', 'name', 'email']
        }
      ],
      transaction
    });

    if (!bid) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // 2. Check if user is the gig owner
    if (bid.gig.clientId !== userId) {
      await transaction.rollback();
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Only gig owner can hire freelancers'
      });
    }

    // 3. Check if gig is still open
    if (bid.gig.status !== 'open') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot hire. Gig is already ${bid.gig.status}`
      });
    }

    await db.Gig.update(
      {
        status: 'assigned',
        assignedFreelancerId: bid.freelancerId
      },
      {
        where: { id: bid.gigId },
        transaction
      }
    );

    
    await bid.update(
      { status: 'hired' },
      { transaction }
    );

    
    await db.Bid.update(
      { status: 'rejected' },
      {
        where: {
          gigId: bid.gigId,
           id: { [Op.ne]: bidId }
        },
        transaction
      }
    );

    await transaction.commit();

 
    const updatedGig = await db.Gig.findOne({
      where: { id: bid.gigId },
      attributes: ['id', 'title', 'status', 'assignedFreelancerId']
    });

    const updatedBid = await db.Bid.findOne({
      where: { id: bidId },
      include: [{
        model: db.User,
        as: 'freelancer',
        attributes: ['id', 'name', 'email']
      }]
    });

    console.log('✅ Freelancer hired successfully!');

   
    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully!',
      data: {
        gig: {
          id: updatedGig.id,
          title: updatedGig.title,
          status: updatedGig.status,
          assignedFreelancerId: updatedGig.assignedFreelancerId
        },
        hiredBid: {
          id: updatedBid.id,
          price: updatedBid.price,
          proposal: updatedBid.proposal,
          deliveryTime: updatedBid.deliveryTime,
          status: updatedBid.status,
          freelancer: updatedBid.freelancer
        }
      }
    });

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    
    console.error('❌ Error hiring freelancer:', error);
    res.status(500).json({
      success: false,
      message: 'Error hiring freelancer',
      error: error.message
    });
  }
};


exports.createBid = async (req, res) => {
  console.log('=== CREATE BID DEBUG ===');
  console.log('User ID:', req.user.id);
  console.log('Body:', req.body);
  
  try {
    const { gigId, price, proposal, message, deliveryTime = 7 } = req.body;
    const freelancerId = req.user.id;
    
    console.log('Freelancer ID:', freelancerId);
    
    
    const finalProposal = proposal || message;
    
    
    if (!finalProposal || finalProposal.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Proposal is required'
      });
    }
    
    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: 'Valid price is required'
      });
    }
    
    if (!gigId) {
      return res.status(400).json({
        success: false,
        message: 'Gig ID is required'
      });
    }

  
    const gig = await db.Gig.findOne({
      where: { 
        id: gigId,
        status: 'open'
      }
    });

    console.log('Gig found:', gig ? 'YES' : 'NO');
    if (gig) console.log('Gig status:', gig.status);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found or not accepting bids'
      });
    }

    if (gig.clientId === freelancerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

  
    const existingBid = await db.Bid.findOne({
      where: {
        gigId: gigId,
        freelancerId: freelancerId
      }
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already placed a bid on this gig'
      });
    }


    const bid = await db.Bid.create({
      gigId,
      freelancerId,
      price: parseFloat(price),
      proposal: finalProposal,
      deliveryTime: parseInt(deliveryTime),
      status: 'pending'
    });

    console.log('✅ Bid created:', {
      id: bid.id,
      gigId: bid.gigId,
      freelancerId: bid.freelancerId,
      status: bid.status
    });


    const newBid = await db.Bid.findOne({
      where: { id: bid.id },
      include: [{
        model: db.User,
        as: 'freelancer',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully!',
      data: newBid
    });

  } catch (error) {
    console.error('❌ Error creating bid:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting bid',
      error: error.message
    });
  }
};