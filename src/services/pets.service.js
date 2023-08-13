const { Pet } = require('../database/db');
const { queryBuilder } = require('../utils/service-helpers');

function PetService() {
  const excludedFields = [
    'publisherId',
    'isPublished',
    'goodWithChildren',
    'goodWithDogs',
    'goodWithCats',
  ];

  async function findAll(queryParams) {
    const query = queryBuilder(queryParams, excludedFields);
    return await Pet.findAndCountAll(query);
  }

  async function findOne(id) {
    return await Pet.findByPk(id);
  }

  async function create(pet) {
    const requiredFields = [
      'type',
      'status',
      'name',
      'breed',
      'color',
      'age',
      'gender',
      'weight',
      'photoUrl',
      'publisherId',
    ];
    requiredFields.forEach((field) => {
      if (!pet[field]) {
        throw new Error(`Field ${field} is required`);
      }
    });
    return await Pet.create(pet);
  }

  async function update(petId, payload) {
    const {
      type,
      status,
      name,
      breed,
      color,
      age,
      weight,
      photoUrl,
      description,
      hypoallergenic,
      dietaryRestrictions,
      goodWithChildren,
      goodWithDogs,
      goodWithCats,
    } = payload;
    const updatedData = {
      type,
      status,
      name,
      breed,
      color,
      age,
      weight,
      photoUrl,
      description,
      hypoallergenic,
      dietaryRestrictions,
      goodWithChildren,
      goodWithDogs,
      goodWithCats,
    };

    return await Pet.update(updatedData, {
      where: { id: petId },
    });
  }

  async function remove(petId) {
    return await Pet.destroy({
      where: { id: petId },
    });
  }

  async function removeAll() {
    return await Pet.destroy({
      where: {},
      truncate: false,
    });
  }

  async function recent() {
    return await Pet.findAll({
      where: { isPublished: true },
      attributes: { exclude: [...excludedFields, 'createdAt', 'updatedAt'] },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
  }

  async function findByAvailability(status) {
    const allowedStatus = ['Available', 'Fostered', 'Adopted'];
    if (!allowedStatus.includes(status)) {
      throw new Error(`Status ${status} is not allowed`);
    }
    return await Pet.findAll({
      where: { status, isPublished: true },
      attributes: { exclude: [...excludedFields, 'createdAt', 'updatedAt'] },
    });
  }

  return {
    create,
    update,
    remove,
    findAll,
    findOne,
    findByAvailability,
    removeAll,
    recent,
  };
}

module.exports = PetService();
