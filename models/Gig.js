
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
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'open'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assignedFreelancerId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'gigs',
  timestamps: true
});

module.exports = Gig;