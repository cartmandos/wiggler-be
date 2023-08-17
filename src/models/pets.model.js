const { Model, DataTypes } = require('sequelize');
const { capitalize } = require('../utils/core-helpers');

module.exports = (sequelize) => {
  class Pet extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        targetKey: 'uid',
        foreignKey: 'publisherId',
      });
      this.belongsToMany(models.User, {
        through: models.Adoption,
        foreignKey: 'petId',
        as: 'adopter',
      });
    }
  }

  Pet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Adopted', 'Fostered', 'Available'],
        defaultValue: 'Available',
        set(value) {
          this.setDataValue('status', capitalize(value));
        },
      },
      type: {
        type: DataTypes.ENUM,
        values: ['Dog', 'Cat'],
        allowNull: false,
        set(value) {
          this.setDataValue('type', capitalize(value));
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Name is required.',
          },
        },
      },
      breed: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Breed is required.',
          },
        },
      },
      color: {
        type: DataTypes.ENUM,
        values: ['brown', 'black', 'white', 'grey', 'orange', 'red', 'golden', 'tuxedo'],
        allowNull: false,
        set(value) {
          this.setDataValue('color', value.toLowerCase());
        },
      },
      age: {
        type: DataTypes.SMALLINT, //months
        validate: {
          min: {
            args: [1],
            msg: 'Age must be a positive value.',
          },
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: ['Male', 'Female'],
        allowNull: false,
        set(value) {
          this.setDataValue('gender', capitalize(value));
        },
      },
      weight: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Weight must be a positive value.',
          },
        },
      },
      /*       height: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'Height must be a positive value.',
          },
        },
      }, */
      photoUrl: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Photo URL is required.',
          },
          isUrl: {
            msg: 'Invalid photo URL format.',
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      dietaryRestrictions: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'None',
      },
      hypoallergenic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      goodWithChildren: {
        type: DataTypes.BOOLEAN,
      },
      goodWithDogs: {
        type: DataTypes.BOOLEAN,
      },
      goodWithCats: {
        type: DataTypes.BOOLEAN,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      publisherId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      indexes: [
        {
          unique: false,
          name: 'available_by_type',
          fields: ['type', 'status'],
          where: {
            status: 'Available',
            isPublished: true,
          },
        },
      ],
      modelName: 'Pet',
      tableName: 'Pets',
    }
  );

  return Pet;
};
