# API Endpoints Documentation

## Authentication
- `POST /api/auth/register` - Register a new user
  - Request body: `{ name, email, password }`
  - Response: `{ _id, name, email, token }`

- `POST /api/auth/login` - Login user
  - Request body: `{ email, password }`
  - Response: `{ _id, name, email, token }`

## Tickets
- `GET /api/tickets` - Get all tickets for logged in user
  - Headers: `Authorization: Bearer <token>`
  - Response: `[ { _id, title, description, status, createdAt }, ... ]`

- `POST /api/tickets` - Create new ticket
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ title, description, product }`
  - Response: `{ _id, title, description, status, createdAt }`

- `GET /api/tickets/:id` - Get single ticket
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ _id, title, description, status, createdAt }`

- `PUT /api/tickets/:id` - Update ticket status
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ status }`
  - Response: `{ _id, title, description, status, createdAt }`