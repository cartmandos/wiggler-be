# Pet Adoption Project

Pet Adoption Project is a web application that allows users to browse and adopt pets from a database of available animals. Users can search for pets, view their details, and submit adoption requests.

## Features

- User registration and authentication, profile management
- Admin/User role-based access control
- Search for pets by various criteria (type, breed, status, age, etc.)
- Browse pet details including images, description, and adoption status, etc
- Adoption actions (adopt, foster, return)
- Save pets actions for later viewing

## Main Technologies

- **Runtime Environment**: *Node.js*
- **Server Framework**: *Express.js*
- **Database**: *PostgreSQL*
- **ORM**: *Sequelize*
- **Auth**: *JWT* (cookie-based access tokens)

## Data Model

![Data Model](./docs/data-model.png)

## Run Server

```bash
# [NODE_ENV=production]
npm run start
```

```bash
# [NODE_ENV=development]
npm run dev
```

## API (v1)

### Authentication Endpoints (`/auth`)

| Path                    | Method | Description                                                              |
| ----------------------- | ------ | ------------------------------------------------------------------------ |
| `/api/v1/auth/register` | POST   | Register a new user.                                                     |
| `/api/v1/auth/login`    | POST   | Authenticate and generate a JSON Web Token (JWT) for user authorization. |

### User Endpoints (`/users`)

| Path                                  | Method | Description                                          |
| ------------------------------------- | ------ | ---------------------------------------------------- |
| `/api/v1/users`                       | GET    | Retrieve a list of all users.                        |
| `/api/v1/users/:id`                   | GET    | Get information about a specific user.               |
| `/api/v1/users/:id`                   | DELETE | Delete a user from the system.                       |
| `/api/v1/users/:id/profile`           | GET    | Get the user's profile information.                  |
| `/api/v1/users/:id/profile`           | PUT    | Update a user's information.                         |
| `/api/v1/users/:id/saved-pets`        | GET    | Retrieve a list of pets saved by a user.             |
| `/api/v1/users/:id/saved-pets`        | POST   | Save a pet for a user.                               |
| `/api/v1/users/:id/saved-pets/:petId` | DELETE | Remove a saved pet from a user's list.               |
| `/api/v1/users/:id/adoptions`         | GET    | Retrieve a list of adoption requests made by a user. |

### Pet Endpoints (`/pets`)

| Path                            | Method | Description                                         |
| ------------------------------- | ------ | --------------------------------------------------- |
| `/api/v1/pets`                  | GET    | Retrieve a list of all available pets.              |
| `/api/v1/pets`                  | POST   | Add a new pet to the system.                        |
| `/api/v1/pets/recently-added`   | GET    | Get a list of the most recently added pets.         |
| `/api/v1/pets/available`        | GET    | Get a list of pets available for adoption.          |
| `/api/v1/pets/:petId`           | GET    | Retrieve detailed information about a specific pet. |
| `/api/v1/pets/:petId`           | PUT    | Update information for a specific pet.              |
| `/api/v1/pets/:petId`           | DELETE | Delete a pet from the system.                       |
| `/api/v1/pets/:petId/adoptions` | POST   | Submit an adoption request for a pet.               |
| `/api/v1/pets/:petId/adoptions` | DELETE | Cancel an adoption request for a pet.               |
| `/api/v1/pets/:petId/upload`    | POST   | Upload an image for a pet.                          |

## License

This project is licensed under the [MIT License](LICENSE).
