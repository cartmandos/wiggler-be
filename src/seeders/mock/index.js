const fs = require('node:fs');
const path = require('node:path');

async function seedMockData(db) {
  const { Role, User, Pet } = db;

  const seedData = async (dbModel, data) => {
    try {
      await dbModel.bulkCreate(data);
      console.log(`Seeded ${data.length} rows in model '${dbModel.name}'.`);
    } catch (error) {
      console.error(`Unable to seed mock for ${dbModel?.name}.`, error);
    }
  };

  const parseJSONData = (jsonFile) => {
    const rawData = fs.readFileSync(path.join(__dirname, jsonFile));
    const parsedData = JSON.parse(rawData);
    return parsedData ? parsedData : [];
  };

  const rolesData = [{ name: 'user' }, { name: 'admin' }];
  const usersData = parseJSONData('users.mock.data.json');
  const petsData = parseJSONData('pets.mock.data.json');

  await seedData(Role, rolesData);
  await seedData(User, usersData);
  await seedData(Pet, petsData);
  console.log(
    `Mock data seeded: ${rolesData.length} roles, ${usersData.length} users, ${petsData.length} pets`
  );
}

module.exports = { seedMockData };
