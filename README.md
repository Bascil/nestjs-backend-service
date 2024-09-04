# nestjs-backend-service

Backend service built with NestJs 10. Includes unit tests and benchmarking tools to ensure robustness and efficiency.

### Features

The project is built with a focus on performance, scalability, and maintainability:

- Role Based Access Control: Admin, Manager, Engineer.
- Permissions: Each role has associated permissions.
- CRM: Customers, Projects, Tasks and Leads.

## Installation

1. Clone the repository and then install required dependencies

```
git clone git@github.com:Bascil/nestjs-backend-service.git
```

2. Navigate to the target directory

```
cd nestjs-backend-service
```

3. Install dependencies

```bash
$ npm install
```

4. Configure environment variables

```
cp .env.example .env
```

```
MYSQL_PRISMA_URL="mysql://username:password@localhost:3306/database_name?sslmode=require"
MYSQL_URL_NO_SSL="mysql://username:password@localhost:3306/database_name"

MYSQL_URL_NON_POOLING="mysql://username:password@localhost:3306/database_name"

JWT_SECRET=test
JWT_EXPIRES_IN=1D
TOKEN_TYPE=Bearer

JWT_REFRESH_SECRET=test
JWT_REFRESH_EXPIRES_IN=7D
```

5. Run database seed

```
npm run seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
