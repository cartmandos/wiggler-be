const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  class SavedPet extends Model {
    static associate(models) {
      models.User.belongsToMany(models.Pet, {
        through: this,
        foreignKey: 'userId',
        otherKey: 'petId',
        as: 'savedPets',
      });
      models.Pet.belongsToMany(models.User, {
        through: this,
        foreignKey: 'petId',
        otherKey: 'userId',
      });
    }
  }

  SavedPet.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      petId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      updatedAt: false,
      createdAt: 'savedAt',
      indexes: [{ unique: false, fields: ['userId'] }],
      modelName: 'SavedPet',
      tableName: 'SavedPets',
    }
  );
  return SavedPet;
};
