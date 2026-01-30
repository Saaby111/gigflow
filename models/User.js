
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  
  role: {
    type: DataTypes.ENUM('client', 'freelancer'),
    allowNull: false,
    defaultValue: 'client'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

// REMOVE any associate function if it exists
// User.associate = (models) => { ... }

module.exports = User;