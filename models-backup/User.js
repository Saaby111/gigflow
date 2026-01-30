// backend/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import sequelize directly

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
    defaultValue: 'freelancer'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;