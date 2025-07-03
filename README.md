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

## Project structure

```
back-invitation/
│
├── prisma/
│   └── schema.prisma         # Database schema and migrations
│
├── src/
│   ├── errors/               # Custom error classes (empty for now)
│   ├── plugins/              # Plugins and configuration
│   │   ├── awilix.ts         # Dependency injection container
│   │   ├── dotenv.ts         # Environment variables config (exports 'env')
│   │   ├── index.ts          # Exports plugins (container, prisma, env)
│   │   ├── prisma.ts         # Prisma client instance
│   │   └── zod.ts            # Zod instance for validation
│   ├── repositories/         # Data access layer (empty for now)
│   ├── routes/               # API routes
│   │   ├── index.ts          # Exports all routes
│   │   └── user.ts           # User-related routes
│   ├── services/             # Business logic
│   │   ├── classes/          # Service classes (empty for now)
│   │   └── interfaces/       # Service interfaces (empty for now)
│   ├── types/                # Custom TypeScript types (empty for now)
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
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}"
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