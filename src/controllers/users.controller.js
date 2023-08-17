const { AppError } = require('../errors');
const { NOT_FOUND, NO_CONTENT } = require('../utils/http-status');
const { UserService } = require('../services');
const { paginationBuilder } = require('../utils/service-helpers');

async function getAllUsers(req, res, next) {
  try {
    const queryParams = req.queryParams;
    const users = await UserService.findAll(queryParams);
    const pagination = paginationBuilder(users, queryParams, req.originalUrl.split('?')[0]);

    res.send({
      users: users.rows,
      pagination,
    });
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  const { id } = req.params;
  try {
    const user = await UserService.findOne(id);

    res.send(user);
  } catch (error) {
    next(error);
  }
}

async function editUser(req, res, next) {
  const { id } = req.params;
  const userData = req.body;

  try {
    const updatedUser = await UserService.update(id, userData);
    if (!updatedUser) {
      return res.status(NO_CONTENT).end();
    }
    res.send({
      message: `User updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;
  try {
    const deletedCount = await UserService.remove(id);

    res.status(NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
}

async function savePet(req, res, next) {
  const { id } = req.params;
  const { petId } = req.body;
  try {
    const savedPet = await UserService.createSavedPet(id, petId);
    if (!savedPet) {
      throw new AppError('Pet was not found', NOT_FOUND);
    }

    res.send({
      message: 'Pet saved',
    });
  } catch (error) {
    next(error);
  }
}

async function unsavePet(req, res, next) {
  const { id, petId } = req.params;
  try {
    const deletedCount = await UserService.removeSavedPet(id, petId);
    if (deletedCount == 0) {
      throw new AppError('Pet not found', NOT_FOUND);
    }

    res.status(NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

async function getSavedPets(req, res, next) {
  const { id } = req.params;
  const { queryParams } = req;

  try {
    const savedPets = await UserService.findSavedPets(id, queryParams);

    res.send({
      message: 'Saved pets retrieved successfully',
      savedPets,
    });
  } catch (error) {
    next(error);
  }
}

async function getAdoptions(req, res, next) {
  const { id } = req.params;
  const { queryParams } = req;

  try {
    const adoptions = await UserService.findOwnedPets(id, queryParams);

    res.send({
      message: 'Adoptions retrieved successfully',
      adoptions,
    });
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  const { id } = req.params;
  try {
    const profile = await UserService.findProfile(id);
    if (!profile) {
      throw new AppError(`User with user id ${id} does not exist`, NOT_FOUND);
    }

    res.send({
      message: 'User profile retrieved successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUser,
  editUser,
  deleteUser,
  savePet,
  unsavePet,
  getSavedPets,
  getAdoptions,
  getProfile,
};
