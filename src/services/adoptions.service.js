const { Adoption, Pet } = require('../database/db');

function AdoptionService() {
  async function adopt(petId, payload) {
    const { userId, adoptionType } = payload;
    const newStatus = adoptionType === 'adoption' ? 'adopted' : 'fostered';
    const updatedRows = await Pet.update(
      { status: newStatus },
      { where: { status: 'available', id: petId } }
    );
    if (updatedRows == 0) {
      throw new Error('Pet not found or not available.');
    }

    const adoption = {
      adopterId: userId,
      petId,
      adoptionType,
    };
    return await Adoption.create(adoption);
  }

  async function returnPet(petId, userId) {
    const updatedRows = await Pet.update(
      { status: 'available' },
      { where: { id: petId } }
    );
    if (updatedRows == 0) {
      throw new Error('Pet not found or not available.');
    }

    const deletedRows = await Adoption.destroy({
      where: { adopterId: userId, petId },
    });
    return deletedRows;
  }

  return {
    adopt,
    returnPet,
  };
}

module.exports = AdoptionService();
