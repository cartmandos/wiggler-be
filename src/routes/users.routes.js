const usersRouter = require('express').Router();
const { usersController: users } = require('../controllers');
const {
  auth,
  handleMeParam,
  checkPermissions,
} = require('../middleware/auth.middleware');
const { queryStringHandler } = require('../middleware/query-string-handler');

usersRouter.use(auth);

usersRouter
  .route('/')
  .get([checkPermissions, queryStringHandler], users.getAllUsers);


usersRouter
  .route('/:id')
  .all(handleMeParam, checkPermissions)
  .get(users.getUser)
  .delete(users.deleteUser)
  .put(users.editUser);

usersRouter
  .route('/:id/profile')
  .get([handleMeParam, checkPermissions], users.getProfile);

usersRouter
  .route('/:id/saved-pets')
  .all(handleMeParam, checkPermissions)
  .get(queryStringHandler, users.getSavedPets)
  .post(users.savePet);

usersRouter
  .route('/:id/saved-pets/:petId')
  .delete([handleMeParam, checkPermissions], users.unsavePet);

usersRouter
  .route('/:id/adoptions')
  .get(
    [handleMeParam,checkPermissions, queryStringHandler],
    users.getAdoptions
  );

module.exports = usersRouter;
