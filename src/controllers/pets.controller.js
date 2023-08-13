const {AppError} = require('../errors');
const { NOT_FOUND, CREATED, NO_CONTENT } = require('../utils/http-status');
const { PetService, AdoptionService } = require('../services');
const { paginationBuilder } = require('../utils/service-helpers');

async function getAllPets(req, res, next) {
  const queryParams = req.queryParams;
  try {
    const pets = await PetService.findAll(queryParams);
    res.send({
      message: 'Pets retrieved successfully',
      pets: pets.rows,
      pagination: paginationBuilder(
        pets,
        queryParams,
        req.originalUrl.split('?')[0]
      ),
    });
  } catch (error) {
    next(error);
  }
}

async function getPet(req, res, next) {
  const { petId } = req.params;

  try {
    const pet = await PetService.findOne(petId);
    if (!pet) {
      throw new AppError('Pet was not found', NOT_FOUND);
    }

    res.send({
      message: 'Pet retrieved successfully',
      pet,
    });
  } catch (error) {
    next(error);
  }
}

async function addPet(req, res, next) {
  const { uid } = res.locals.user;
  const petData = req.body;

  try {
    const pet = await PetService.create({ ...petData, publisherId: uid });

    res.status(CREATED).send({
      message: 'Pet added successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function editPet(req, res, next) {
  const { petId } = req.params;
  const petData = req.body;

  try {
    const updatedCount = await PetService.update(petId, petData);
    if (updatedCount == 0) {
      throw new AppError(`Pet with id ${petId} does not exist`, NOT_FOUND);
    }

    res.send({
      message: 'Pet updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

async function deletePet(req, res, next) {
  const { petId } = req.params;

  try {
    const deletedCount = await PetService.remove(petId);
    if (deletedCount == 0) {
      throw new AppError(`Pet with id ${petId} does not exist`, NOT_FOUND);
    }

    res.status(NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

async function deleteAll(req, res, next) {
  try {
    const deletedCount = await PetService.removeAll();
    if (deletedCount == 0) {
      throw new AppError('Pets not found', NOT_FOUND);
    }

    res.status(NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

async function adoptPet(req, res, next) {
  const { petId } = req.params;
  const { uid } = res.locals.user;
  const adopterData = { userId: uid, ...req.body };

  try {
    const adoption = await AdoptionService.adopt(petId, adopterData);

    res.send({
      message: 'Pet adopted successfully',
      adoption,
    });
  } catch (error) {
    next(error);
  }
}

async function returnPet(req, res, next) {
  const { petId } = req.params;
  const { uid } = res.locals.user;
  const { userId } = req.body;
  try {
    const deletedCount = await AdoptionService.returnPet(petId, userId || uid);
    if (deletedCount == 0) {
      throw new AppError('Pet not found or already available', NOT_FOUND);
    }

    res.status(NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}

async function addImage(req, res, next) {
  const { petId } = req.params;
  const { path } = req.file;
  try {
    const updatedCount = await PetService.update(petId, { photoUrl: path });
    if (updatedCount == 0) {
      throw new AppError(`Pet with id ${petId} does not exist`, NOT_FOUND);
    }

    res.send({
      message: 'Pet image added successfully',
      imageUrl: path,
    });
  } catch (error) {
    next(error);
  }
}

async function getRecentlyAddedPets(req, res, next) {
  try {
    const pets = await PetService.recent();
    if (!pets) {
      throw new AppError('Pets were not found', NOT_FOUND);
    }

    res.send({
      message: 'Recently added pets retrieved successfully',
      pets,
    });
  } catch (error) {
    next(error);
  }
}

async function getAvailablePets(req, res, next) {
  const status = 'Available';

  try {
    const availablePets = await PetService.findByAvailability(status);
    if (!availablePets) {
      throw new AppError('Pets were not found', NOT_FOUND);
    }

    res.send({
      message: 'Pets retrieved successfully',
      pets: availablePets,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllPets,
  addPet,
  getPet,
  editPet,
  deletePet,
  deleteAll,
  addImage,
  adoptPet,
  returnPet,
  getRecentlyAddedPets,
  getAvailablePets,
};
