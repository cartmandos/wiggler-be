const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Adoption extends Model {
    static associate(models) {
      this.belongsTo(models.Pet, {
        foreignKey: 'petId',
        as: 'pet',
      });
      this.belongsTo(models.User, {
        as: 'adopter',
        targetKey: 'uid',
        foreignKey: 'adopterId',
      });
    }
  }

  Adoption.init(
    {
      petId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      adopterId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      adoptionType: {
        type: DataTypes.ENUM,
        values: ['adoption', 'fostering'],
        allowNull: false,
        set(value) {
          this.setDataValue('adoptionType', value.toLowerCase());
        },
      },
    },
    {
      sequelize,
      updatedAt: false,
      createdAt: 'adoptedAt',
      indexes: [{ unique: false, fields: ['adopterId'] }],
      modelName: 'Adoption',
      tableName: 'Adoptions',
    }
  );

  return Adoption;
};
