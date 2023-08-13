const petsRouter = require('express').Router();
const { petsController: pets } = require('../controllers');
const { handleUpload } = require('../middleware/upload-image-handler');
const { auth, isAdmin } = require('../middleware/auth.middleware');
const { queryStringHandler } = require('../middleware/query-string-handler');

petsRouter.get('/', [queryStringHandler], pets.getAllPets);
petsRouter.get('/recently-added', pets.getRecentlyAddedPets);
petsRouter.get('/available', pets.getAvailablePets);
petsRouter.get('/:petId', pets.getPet);

petsRouter.use(auth);

petsRouter.route('/').all(isAdmin).post(pets.addPet).delete(pets.deleteAll);

petsRouter
  .route('/:petId')
  .all(isAdmin)
  .put(pets.editPet)
  .delete(pets.deletePet);

petsRouter
  .route('/:petId/adoptions')
  .post(pets.adoptPet)
  .delete(pets.returnPet);

petsRouter.post(
  '/:petId/upload',
  handleUpload.single('pet_image'),
  pets.addImage
);

module.exports = petsRouter;
