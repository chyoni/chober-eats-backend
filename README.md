# UberEats Clone

- #01 First init

  ```bash
  nest generate application

      - application name: **uber-eats-backend**
  ```

  > go to application folder (uber-eats-backend)

  ```bash
  npm i (download all package and module in package.json)
  ```

  > Create Github repository

  > git init

  > create .gitignore file

  > git remote add origin [your repository url]

  > git add .

  > git commit -m "#01 First init"

  > git push origin master

- #02 Settings for GraphQL 1

  ```bash

  npm i @nestjs/graphql graphql-tools graphql apollo-server-express

  ```

- #03 Settings for GraphQL 2

  > https://docs.nestjs.com/graphql/quick-start#code-first

- #04 How to ObjectType Settings for GraphQL

- #05 How to pass Argument GraphQL

- #06 How to pass Argument GraphQL for ArgsType not InputType

- #07 DTO Validator and Pipe

  ```bash
  npm i class-validator

  npm i class-transformer
  ```

---

## DB Settings (PostgreSQL)

---

- #08 TypeORM Settings and .env file Settings

  ```bash

  npm install --save @nestjs/typeorm typeorm pg

  npm install --save @nestjs/config

  npm install cross-env

  ```

- #09 Validating ConfigService

  ```bash
  npm i joi
  ```

- #10 Generate Entity with TypeORM and GraphQL

- #11 Inject TypeORM Repository, Service, Resolver

- #12 Create record by using TypeORM

- #13 Mapped Type (OmitType)

  > https://docs.nestjs.com/openapi/mapped-types

- #14 GraphQL DefaultValue, TypeORM Default

- #15 Update Data with GraphQL, TypeORM 1

- #16 Update Data with GraphQL, TypeORM 2

- #17 Let's Start User Model (Real Clone)

- #18 Create Account Mutation 1
