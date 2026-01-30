
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bid = sequelize.define('Bid', {
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  proposal: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryTime: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'hired', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
  gigId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  freelancerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'bids',
  timestamps: true,
  underscored: true 
});

module.exports = Bid;