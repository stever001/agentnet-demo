// backend/models/Schema.js
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
    references: {
      model: Agent,
      key: 'id',
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jsonLd: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Schema.belongsTo(Agent, { foreignKey: 'agentId', onDelete: 'CASCADE' });

module.exports = Schema;
