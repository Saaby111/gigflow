const { Gig, User, Bid, sequelize } = require('../models');
const db = require('../models');


exports.getAllGigs = async (req, res) => {
  try {
    console.log('📋 Fetching all gigs...');
    
    const gigs = await Gig.findAll({
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${gigs.length} gigs`);
    
    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
    
  } catch (error) {
    console.error('❌ Error in getAllGigs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


exports.getGig = async (req, res) => {
  console.log('=== GET GIG DEBUG ===');
  console.log('Gig ID:', req.params.id);
  console.log('User:', req.user);
  
  try {
    const { id } = req.params;
    
    const gig = await db.Gig.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    console.log('Gig found:', gig ? 'YES' : 'NO');
    
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
    console.error('❌ Error fetching gig:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

exports.getMyGigs = async (req, res) => {
  try {
    console.log(`📊 Fetching gigs for user: ${req.user.id}`);
    
    const gigs = await Gig.findAll({
      where: { clientId: req.user.id },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${gigs.length} gigs for user`);
    
    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    console.error('❌ Error in getMyGigs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.getOpenGigs = async (req, res) => {
  try {
    console.log('Fetching open gigs...');
    
    const gigs = await Gig.findAll({
      where: { status: 'open' }, 
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log(`✅ Found ${gigs.length} open gigs`);
    
    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
    
  } catch (error) {
    console.error('❌ Error in getOpenGigs:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


exports.createGig = async (req, res) => {
  try {
    const { title, description, budget, category, deadline, requirements } = req.body;
    
    console.log(`📝 Creating gig for user: ${req.user.id}`);
    
    const gig = await Gig.create({
      title,
      description,
      budget: parseFloat(budget),
      category: category || 'Other',
      deadline,
      requirements,
      clientId: req.user.id,
      status: 'open'
    });
    
    console.log(`✅ Gig created with ID: ${gig.id} - ${gig.title}`);
    
    res.status(201).json({
      success: true,
      message: 'Gig created successfully',
      data: gig
    });
    
  } catch (error) {
    console.error('❌ Create gig error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating gig',
      error: error.message
    });
  }
};


exports.getAllGigsAdmin = async (req, res) => {
  try {
    console.log('📋 Admin: Fetching all gigs...');
    
    const gigs = await Gig.findAll({
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    console.error(' Admin gigs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.updateGig = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating gig ${id} for user: ${req.user.id}`);
    
    let gig = await Gig.findByPk(id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
    
    if (gig.clientId !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    
    if (gig.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update gig that is already assigned or completed'
      });
    }
    
    gig = await gig.update(req.body);
    
    console.log(`✅ Gig ${id} updated`);
    
    res.status(200).json({
      success: true,
      message: 'Gig updated successfully',
      data: gig
    });
  } catch (error) {
    console.error('❌ Update gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.deleteGig = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Deleting gig ${id} for user: ${req.user.id}`);
    
    const gig = await Gig.findByPk(id);
    
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }
    
  
    if (gig.clientId !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    await gig.destroy();
    
    console.log(`✅ Gig ${id} deleted`);
    
    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete gig error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


exports.hireFreelancer = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { gigId, bidId } = req.params;
    
    console.log(`Hiring freelancer for gig ${gigId}, bid ${bidId}`);

 
    const gig = await Gig.findByPk(gigId, { transaction });
    if (!gig) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

 
    if (gig.clientId !== req.user.id) {
      await transaction.rollback();
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    gig.status = 'assigned';
    await gig.save({ transaction });

  
    const selectedBid = await Bid.findByPk(bidId, { transaction });
    if (!selectedBid) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    selectedBid.status = 'hired';
    await selectedBid.save({ transaction });

    
    await Bid.update(
      { status: 'rejected' },
      {
        where: {
          gigId: gigId,
          id: { $ne: bidId },
          status: 'pending'
        },
        transaction
      }
    );

    await transaction.commit();
    
    console.log(`✅ Freelancer hired for gig ${gigId}`);

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Hire freelancer error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};