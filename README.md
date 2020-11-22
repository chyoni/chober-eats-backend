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

- #19 Create Account Mutation 2

- #20 Create Account Mutation 3

- #21 The Way better handling error code

- #22 Hashing Password

  > https://typeorm.io/#/listeners-and-subscribers

  ```bash
  npm i bcrypt

  npm i @types/bcrypt --dev-only
  ```

- #23 Login 1

- #24 Login 2

- #25 Create Our Module (Generating JWT 1, Login 3)

  > https://randomkeygen.com/

  ```bash
  npm i jsonwebtoken

  npm i @types/jsonwebtoken --only-dev

  nest g mo jwt
  nest g s jwt
  ```

  > 모듈을 글로벌로 설정하면 (우리가 직접 만든 모듈에 Global decorator를 쓰던, forRoot() 옵션에 isGlobal:true을 하던) 다른 모듈에서 그 모듈의 Service를 사용하려 할 때, (비단 Service 뿐만 아니라) import에 굳이 Service를 넣을 필요 없이 바로 그냥 injection이 가능하다.

- #26 Create Our Module 2

  > How to pass option into service (answer: Injection)

  > How to make forRoot option (answer: make interface class)

- #27 Create Our Module 3

- #28 Middlewars in NestJS

- #29 JWT Middleware

- #30 GraphQL Context

- #31 Auth Guard

  > https://docs.nestjs.com/guards

  ```bash
  nest g mo auth
  ```

- #32 Create Our Decorator

- #33 get User Profile

- #34 Update Profile

- #35 @BeforeUpdate() Condition
