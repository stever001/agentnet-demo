module.exports = (sequelize, DataTypes) => {
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

  Schema.associate = (models) => {
    Schema.belongsTo(models.Agent, { foreignKey: 'agentId' });
  };

  return Schema;
};

