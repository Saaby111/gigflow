// backend/models/index.js
const Sequelize = require('sequelize');

// Import models - DO NOT import sequelize from config here
const User = require('./User');
const Gig = require('./Gig');
const Bid = require('./Bid');

// Get sequelize instance from one of the models
const sequelize = User.sequelize; // or Gig.sequelize or Bid.sequelize

const models = {
  User,
  Gig,
  Bid
};

// Define associations
User.hasMany(Gig, { 
  foreignKey: 'clientId', 
  as: 'postedGigs' 
});

User.hasMany(Bid, { 
  foreignKey: 'freelancerId', 
  as: 'submittedBids' 
});

User.hasMany(Gig, { 
  foreignKey: 'assignedFreelancerId', 
  as: 'assignedGigs' 
});

Gig.belongsTo(User, { 
  foreignKey: 'clientId', 
  as: 'client' 
});

Gig.belongsTo(User, { 
  foreignKey: 'assignedFreelancerId', 
  as: 'assignedFreelancer' 
});

Gig.hasMany(Bid, { 
  foreignKey: 'gigId', 
  as: 'bids' 
});

Bid.belongsTo(Gig, { 
  foreignKey: 'gigId', 
  as: 'gig' 
});

Bid.belongsTo(User, { 
  foreignKey: 'freelancerId', 
  as: 'freelancer' 
});

// Check if sequelize exists before using it
if (sequelize) {
  sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

  // Sync models (development only)
  if (process.env.NODE_ENV !== 'production') {
    sequelize.sync({ alter: true })
      .then(() => console.log('Models synchronized'))
      .catch(err => console.error('Sync error:', err));
  }
} else {
  console.error('Sequelize instance not found. Make sure models are properly defined.');
}

module.exports = {
  User,
  Gig,
  Bid,
  sequelize,
  Sequelize
};