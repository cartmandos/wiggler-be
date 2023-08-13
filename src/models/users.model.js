const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Pet, {
        sourceKey: 'uid',
        foreignKey: 'publisherId',
      });
      this.belongsTo(models.Role, {
        foreignKey: 'roleId',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
      this.belongsToMany(models.Pet, {
        through: models.Adoption,
        as: 'adoptedPets',
        foreignKey: 'adopterId',
      });
    }
  }

  User.init(
    {
      uid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: 'Email address already exists',
        },
        allowNull: false,
        validate: {
          isEmail: {
            msg: 'Invalid email format',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Password cannot be empty',
          },
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'First name cannot be empty',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Last name cannot be empty',
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Phone number cannot be empty',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          isInt: {
            msg: 'Role ID must be an integer',
          },
        },
      },
    },
    {
      sequelize,
      timestamps: true,
      indexes: [{ unique: true, fields: ['email'] }],
      modelName: 'User',
      tableName: 'Users',
    }
  );

  return User;
};
