// backend/models/Agent.js

module.exports = (sequelize, DataTypes) => {
  const Agent = sequelize.define('Agent', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
      allowNull: true,
      unique: true,
    },
    lastCrawledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'no-data', 'error'),
      defaultValue: 'active',
    },
    deactivatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deactivationReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerName: DataTypes.STRING,
    ownerEmail: DataTypes.STRING,
    organization: DataTypes.STRING,
    techContactEmail: DataTypes.STRING,
    billingContactEmail: DataTypes.STRING,
  });

  Agent.associate = (models) => {
    Agent.hasMany(models.Schema, { foreignKey: 'agentId' });
  };

  return Agent;
};
