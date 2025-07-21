// backend/models/Agent.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Agent = sequelize.define('Agent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: true, // Optional for public URLs
  },
  lastCrawledAt: {
    type: DataTypes.DATE,
    allowNull: true, // Will be null until first successful scan
  },
});

module.exports = Agent;
