const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Publisher extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        targetKey: 'uid',
        foreignKey: 'publisherId',
      });
      this.belongsTo(models.Pet, {
        targetKey: 'id',
        foreignKey: 'petId',
      });
    }
  }
  Publisher.init(
    {
      publisherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      petId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      publishedAt: {
        //should be updated when isPublished is set to true
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Publisher',
    }
  );
  return Publisher;
};

/*
//TODO: Publisher model
Design reasoning:
- Normalizing the Pet model, which shouldn't be responsible for storing publish-related data.
API features:
- Allowing users to add a pet, that will be pending request for admin approval.
- Allowing user to have published pets, and pets to have a publisher.

Fields: publisherId, petId, isPublished/isApproved, publishedAt
  1. Move isPublished, publisherId to Publisher model
  2. Set isPublished=false, publishedAt=null by default

Associations: 
User => Publisher => Pet (1:M) - one user can have many pets 
Pet => Publisher => User (1:1) - one pet can have one publisher
  1. User => Publisher (1:1 - one user can be a publisher)
  2. Publisher => Pet (1:M - one publisher can have many pets)
  3. Pet => Publisher (1:1 - one pet can have one publisher)
  4. Publisher => User (1:1 - one publisher can be a user)


Steps:
  3.a. Create Publisher model (sequelize model:create --name Publisher --attributes publisherId:uuid,isPublished:boolean,publishedAt:date)
  3.b. Create Publisher migration (sequelize migration:create --name create-publisher)
  3.c. Create Publisher controller (Layer responsible for handling incoming requests and returning responses to the client.)
    3.c.1. Endpoint: POST /api/v1/pets/:petId/publish (controller: publishPet)
    3.c.2. Endpoint: POST /api/v1/pets/:petId/unpublish (controller: unpublishPet)
    3.c.3. Endpoint: GET /api/v1/pets/published (controller: getPublishedPets)
    3.c.5. Endpoint: GET /api/v1/users/:userId/published-pets (controller: getPublishedPetsByUser)
  3.d. Create Publisher service (Layer responsible for business logic and data manipulation)
  3.e. Create Publisher routes (Layer responsible for routing incoming requests to the appropriate controller.)
  3.f. Create Publisher repository (Layer responsible for data access and manipulation. It should be used only by the service layer.)
  3.g. Create Publisher DTO (Layer responsible for data validation and sanitization.)
*/
