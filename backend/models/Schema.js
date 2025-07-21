// models/Schema.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Agent = require('./Agent');

const Schema = sequelize.define('Schema', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  agentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['agentId', 'type'],
    }
  ]
});

// Set up associations
Schema.belongsTo(Agent, { foreignKey: 'agentId' });
Agent.hasMany(Schema, { foreignKey: 'agentId' });

module.exports = Schema;
