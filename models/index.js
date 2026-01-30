const { Sequelize, Op } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Gig = require('./Gig');
const Bid = require('./Bid');


User.hasMany(Gig, {
  foreignKey: 'clientId',
  as: 'postedGigs'
});
Gig.belongsTo(User, {
  foreignKey: 'clientId',
  as: 'client'
});


User.hasMany(Gig, {
  foreignKey: 'assignedFreelancerId',
  as: 'assignedGigs'
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


User.hasMany(Bid, {
  foreignKey: 'freelancerId',
  as: 'bidsPlaced'
});
Bid.belongsTo(User, {
  foreignKey: 'freelancerId',
  as: 'freelancer'
});


module.exports = {
  sequelize,
  Op,
  Sequelize,
  User,
  Gig,
  Bid
};
