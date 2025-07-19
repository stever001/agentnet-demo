const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Agent = sequelize.define('Agent', {
  name: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT, allowNull: false },
}, {
  timestamps: true,
});

module.exports = Agent;
