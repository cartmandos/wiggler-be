const { User, Role, Pet, SavedPet } = require('../database/db');
const { queryBuilder } = require('../utils/service-helpers');
const { AppError, NotFoundError } = require('../errors');
const Joi = require('joi');

function UserService() {
  const allowedFields = [
    'uid',
    'email',
    'firstName',
    'lastName',
    'phoneNumber',
    'description',
    'createdAt',
    'updatedAt',
  ];
  const excludedFields = ['password', 'roleId'];
  const petExcludedFields = [
    'publisherId',
    'isPublished',
    'createdAt',
    'updatedAt',
  ];

  const validateUserId = (id) => {
    const schema = Joi.string().uuid();
    const { error } = schema.validate(id);
    if (error) {
      console.log('Thrower: isValidUserId');
      throw NotFoundError(`User with user id '${id}' does not exist`, {
        field: 'id',
        id,
      });
    }
  };

  const isEmptyBody = (body) => {
    return Object.keys(body).length === 0;
  };

  const userUpdateDTO = (payload) => {
    //sanitize 1. trim
    if (payload.hasOwnProperty('email')) {
      payload.email = payload.email.trim();
    }

    //validate [trim to remove whitespace]
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(6).max(255),
      firstName: Joi.string().min(2).max(255), // only letters and hyphens = /^[a-zA-Z-]+$/i or /^[a-z-]+$/i
      lastName: Joi.string().min(2).max(255),
      phoneNumber: Joi.string().pattern(/^\+[0-9]+$/).min(11).max(16),
      description: Joi.string(),
    });
    const { error } = schema.validate(payload);
    if (error) {
      console.log('Thrower: userUpdateDTO');
      throw new AppError('Bad request', 400, {
        error: error.details.map((detail) => {
          return {
            field: detail.context.key,
            value: detail.context.value,
          };
        }),
      });
    }
  };

  async function findAll(queryParams) {
    {
      try {
        const query = queryBuilder(queryParams, excludedFields, allowedFields);
        return await User.findAndCountAll(query);
      } catch (error) {
        throw new Error('Failed to retrieve users', { cause: error });
      }
    }
  }

  async function findOne(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: excludedFields },
        include: [
          {
            model: Role,
            attributes: ['name'],
          },
        ],
      });
      if (!user) {
        throw NotFoundError(`User with user id ${userId} does not exist`, {
          field: 'id',
        });
      }
      return user;
    } catch (error) {
      throw new Error('Failed to retrieve user', { cause: error });
    }
  }

  async function findOneByField(field, value) {
    try {
      const user = await User.findOne({
        where: { [field]: value },
        attributes: { exclude: ['roleId'] },
        include: [
          {
            model: Role,
            attributes: ['name'],
          },
        ],
      });
      return user;
    } catch (error) {
      throw new Error('Failed to find user', { cause: error });
    }
  }

  async function create(user) {
    try {
      return await User.create(user);
    } catch (error) {
      throw new Error('Failed to create user', { cause: error });
    }
  }

  async function update(userId, payload) {
    validateUserId(userId);
    const user = await findOne(userId);
    if (isEmptyBody(payload)) {
      return null;
    }
    try {
      const updatableFields = [
        'email',
        'password',
        'firstName',
        'lastName',
        'phoneNumber',
        'description',
      ];

      const updatedData = updatableFields.reduce((acc, key) => {
        if (payload.hasOwnProperty(key)) {
          acc[key] = payload[key];
        }
        if (payload[key] === '') {
          console.log('EMPTY', key);
        } // allowed empty string?
        if (payload[key] === null) {
          console.log('NULL', key);
        } // allowed null?
        return acc;
      }, {});

      if (
        Object.keys(updatedData).length === 0 &&
        Object.keys(payload).length > 0
      ) {
        console.log('Thrower: update');
        throw new AppError('Invalid data', 422, {
          // fields: Object.keys(payload),
          // following format: error: { field: key, value: payload[key] } for each key, implement below:
          error: Object.keys(payload).map((key) => {
            return {
              //not status code, but error code, which to use? = 100? 101? =  => 100 wh
              field: key,
              value: payload[key],
            };
          }),
        });
      }

      userUpdateDTO(updatedData);

      /*  const updatedCount = await User.update(updatedData, {
        where: { uid: userId },
      });
      if (updatedCount == 0) {
        throw NotFoundError(`User with user id ${userId} does not exist`, {
          field: 'id',
        });
      }
      return updatedCount; */
      const updatedUser = await user.update(updatedData);
      return updatedUser;
    } catch (error) {
      console.log('*************************************');
      console.log(error);
      console.log('*************************************');
      throw new Error('Failed to update user', { cause: error });
    }
  }

  async function remove(userId) {
    try {
      const user = await User.destroy({ where: { uid: userId } });
    } catch (error) {
      throw new Error('Failed to delete user', { cause: error });
    }
  }

  async function findProfile(userId) {
    try {
      const fullProfile = await User.findOne({
        where: { uid: userId },
        attributes: {
          exclude: excludedFields,
        },
        include: [
          {
            model: Pet,
            as: 'savedPets',
            attributes: {
              exclude: petExcludedFields,
            },
            through: { attributes: [] },
          },
          {
            model: Pet,
            as: 'adoptedPets',
            attributes: {
              exclude: petExcludedFields,
            },
            through: { attributes: [] },
          },
        ],
      });
      return fullProfile;
    } catch (error) {
      throw new Error('Failed to retrieve full profile', { cause: error });
    }
  }

  async function createSavedPet(userId, petId) {
    try {
      return await SavedPet.create({ userId: userId, petId: petId });
    } catch (error) {
      throw new Error('Failed to save pet', { cause: error });
    }
  }

  async function removeSavedPet(userId, petId) {
    try {
      return await SavedPet.destroy({ where: { userId, petId } });
    } catch (error) {
      throw new Error('Failed to unsave pet', { cause: error });
    }
  }

  async function findSavedPets(userId, queryParams) {
    //const query = queryBuilder(queryParams, petExcludedFields);
    try {
      const userSavedPets = await User.findOne({
        where: { uid: userId },
        attributes: [],
        include: {
          model: Pet,
          as: 'savedPets',
          attributes: {
            exclude: petExcludedFields,
          },
          through: { attributes: [] },
        },
      });
      return userSavedPets.savedPets;
    } catch (error) {
      throw new Error('Failed to retrieve saved pets', { cause: error });
    }
  }

  async function findOwnedPets(userId, queryParams) {
    //const query = queryBuilder(queryParams, petExcludedFields);
    try {
      const adoptions = await User.findOne({
        where: { uid: userId },
        attributes: [],
        include: {
          model: Pet,
          as: 'adoptedPets',
          attributes: {
            exclude: petExcludedFields,
          },
          through: { attributes: [] },
        },
      });
      return adoptions.adoptedPets;
    } catch (error) {
      throw new Error('Failed to retrieve adopted pets', { cause: error });
    }
  }

  return {
    create,
    update,
    remove,
    findAll,
    findOne,
    findOneByField,
    findProfile,
    createSavedPet,
    removeSavedPet,
    findSavedPets,
    findOwnedPets,
  };
}

module.exports = UserService();
