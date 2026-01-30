const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Bid = sequelize.define('Bid', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  proposal: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryTime: {
    type: DataTypes.INTEGER, // days
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'bids',
  timestamps: true
});

module.exports = Bid;