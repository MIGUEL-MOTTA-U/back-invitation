# back-invitation

Backend for wedding invitation page

## Main commands

- `npm run dev`: Starts the server in development mode with automatic reload.
- `npm run build`: Compiles the TypeScript code to JavaScript in the `dist` folder.
- `npm start`: Runs the server in production from `dist`.
- `npm run prisma:generate`: Generates the Prisma client.
- `npm run prisma:migrate`: Runs database migrations.
- `npm test`: Runs tests with Vitest.
- `npm run test:coverage`: Runs tests and shows code coverage.
- `npm run lint`: Linting and code checking with Biome.
- `npm run format`: Formats the code with Biome.
- `npm run docs`: Generates documentation with Typedoc.

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

### Guest Management

#### Create a new guest
- **POST** `/api/v1/guests`
- **Body:**
  ```json
  {
    "name": "string (required, min 1 character)",
    "email": "string (required, valid email)",
    "phone": "string (required, min 10 characters)",
    "phoneCountryCode": "string (required, min 1 character)",
    "message": "string (optional)",
    "confirmed": "boolean (optional, default: false)"
  }
  ```

#### Get all guests (with pagination and search)
- **GET** `/api/v1/guests`
- **Query Parameters:**
  - `page`: number (optional, default: 1)
  - `size`: number (optional, default: 10)
  - `name`: string (optional, search by name)
  - `email`: string (optional, search by email)

#### Get guest by ID
- **GET** `/api/v1/guests/:id`

#### Update guest
- **PUT** `/api/v1/guests/:id`
- **Body:** (all fields optional)
  ```json
  {
    "name": "string (optional)",
    "email": "string (optional, valid email)",
    "phone": "string (optional, min 10 characters)",
    "phoneCountryCode": "string (optional, min 1 character)",
    "message": "string (optional)",
    "confirmed": "boolean (optional)"
  }
  ```

#### Delete guest
- **DELETE** `/api/v1/guests/:id`

## Project structure

```
back-invitation/
│
├── prisma/
│   └── schema.prisma         # Database schema and migrations
│
├── src/
│   ├── errors/               # Custom error classes
│   │   ├── ErrorRepository.ts
│   │   ├── ErrorTemplate.ts
│   │   └── index.ts
│   ├── plugins/              # Plugins and configuration
│   │   ├── diContainer.ts    # Dependency injection container
│   │   ├── dotenv.ts         # Environment variables config
│   │   ├── handlerError.ts   # Error handling
│   │   ├── index.ts          # Exports plugins
│   │   ├── prisma.ts         # Prisma client instance
│   │   ├── routes.ts         # Route registration with prefix
│   │   └── zod.ts            # Zod instance for validation
│   ├── repositories/         # Data access layer
│   │   ├── classes/
│   │   │   └── GuestRepositoryPostgres.ts
│   │   ├── interfaces/
│   │   │   └── GuestRepository.ts
│   │   └── index.ts
│   ├── routes/               # API routes
│   │   ├── index.ts          # Exports all routes
│   │   └── guest.ts          # Guest-related routes
│   ├── services/             # Business logic
│   │   ├── classes/          # Service classes
│   │   └── interfaces/       # Service interfaces
│   ├── types/                # Custom TypeScript types
│   │   ├── Error.ts
│   │   ├── GuestDTO.ts
│   │   ├── OutputMessage.ts
│   │   └── index.ts
│   └── server.ts             # Main Fastify server setup and entry point
│
├── tests/
│   └── index.test.ts         # Example test file (Vitest)
│
├── .env                      # Environment variables
├── docker-compose.yml        # Docker Compose for PostgreSQL
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Environment variables

Create a `.env` file with the following content (adjust as needed):

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=back_invitation
POSTGRES_PORT=6543
# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres:postgres@localhost:6543/back_invitation?pgbouncer=true"
# Direct connection to the database. Used for migrations
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/back_invitation"
```

## Using Docker for PostgreSQL

You can run a PostgreSQL database for development and testing using Docker Compose. The configuration uses environment variables for user, password, database, and port.

1. Make sure your `.env` file is set up as above.
2. Start the database with:
   ```bash
   docker-compose up -d
   ```
3. The database will be available at `localhost:6543` (or the port you set in `POSTGRES_PORT`).

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate the Prisma client:
   ```bash
   npm run prisma:generate
   ```
3. Run migrations (create the database):
   ```bash
   npm run prisma:migrate
   ```
4. Start the server in development:
   ```bash
   npm run dev
   ```

## Testing

- Place your test files in the `tests/` folder or next to the files you want to test using the `.test.ts` or `.spec.ts` suffix.
- Run all tests with:
  ```bash
  npm test
  ```
- To see code coverage:
  ```bash
  npm run test:coverage
  ```

Ready to develop your backend! 🚀