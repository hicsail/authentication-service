![Auth Service](https://user-images.githubusercontent.com/5147346/223544775-4fa42e90-e779-4181-bd57-f6360861df2b.jpeg)

# Authentication Service

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/d098b06d9abd4f009bd748dbc44a1b29)](https://app.codacy.com/gh/hicsail/authentication-service/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/d098b06d9abd4f009bd748dbc44a1b29)](https://app.codacy.com/gh/hicsail/authentication-service/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![License](https://img.shields.io/github/license/hicsail/authentication-service)](https://github.com/hicsail/authentication-service/blob/main/LICENSE)
[![Docker Pulls](https://img.shields.io/docker/pulls/hicsail/auth-server)](https://hub.docker.com/r/hicsail/auth-server)
![Uptime](https://img.shields.io/uptimerobot/ratio/7/m794541356-14a8c11ef199580eeed4f80b)


The Authentication Microservice provides a secure and flexible authentication and authorization system that can be easily integrated into your application. It is designed for developers who need a reliable and scalable authentication solution that can handle large volumes of users and access requests.

# Features

- Flexible Drop-in Authentication UI
- Email registration & login
- User Roles and Permissions

# Deployed URLs

## Staging

| Package      | Urls                                  |
|--------------|---------------------------------------|
| Client       | https://test-auth.sail.codes/         |
| Admin Client | https://test-auth-admin.sail.codes/   |
| Service      | https://test-auth-service.sail.codes/ |

## Production

| Package      | Urls                              |
|--------------|-----------------------------------|
| Client       | https://auth.sail.codes/          |
| Admin Client | https://auth-admin.sail.codes/    |
| Service      | https://auth-service.sail.codes/  |


# Local Development

This section outlines the steps to set up the Authentication Service for local development.

## Prerequisites

Ensure you have the following software installed on your machine:

1. [Docker](https://docs.docker.com/get-docker/)
2. [Node.js](https://nodejs.org/en/download/)
3. [npm](https://www.npmjs.com/get-npm)

## Setup Instructions

1. Open a terminal and navigate to the server package directory:

    ```
    cd packages/server
    ```

2. Build and run the Docker Compose file:

    ```
    docker-compose up -d --build
    ```

3. Install the project's npm dependencies:

    ```
    npm i
    ```

4. Generate Prisma Client JS:

    ```
    npm run prisma:generate
    ```

5. Run Prisma migrations to set up your database schema:

    ```
    npm run prisma:migrate
    ```

6. Start the development server:

    ```
    npm run start:dev
    ```

7. Access the GraphQL Playground at [http://localhost:3001/graphql](http://localhost:3001/graphql).

8. To create a project, use the following GraphQL mutation:

    ```graphql
    mutation {
      createProject(
        project: {
          name: "test",
          description: "test",
          displayProjectName: true,
          allowSignup: true,
          googleAuth: true,
          emailAuth: true
        }
      ) {
        id,
        name
      }
    }
    ```

This mutation will create a new project with the name "test". The project's display name is set to be shown, and both signup and authentication via Google and email are allowed. The server's response will include the new project's id and name.
