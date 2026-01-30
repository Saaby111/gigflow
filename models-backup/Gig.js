const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Gig = sequelize.define('Gig', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  // ... other fields
}, {
  tableName: 'gigs',
  timestamps: true
});

module.exports = Gig;