const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {}
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Role',
      tableName: 'Roles',
    }
  );
  return Role;
};
