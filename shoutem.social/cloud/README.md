# Node seed backend

A node.js seed project for Five Agency projects.

# 🚀 Getting started

This repository is an opinionated boilerplate/seed project for node.js. It's structured with modular architecture and comes with a set of tools already configured.

#### Renaming your project

To rename your project, follow these rules:

- find all occurrences of `node-seed-project` and replace with your project name

## Installing dev tools

This project comes with a docker setup for development and running tests.
Currently however, attaching to debug works only when running server outside of Docker (source map issue in combination with dynamic transpiling)
You are therefore still required to locally install:

- Docker:
  - https://docs.docker.com/install/
- Node.js
  - **Very** recommended to install via Node Version Manager https://github.com/nvm-sh/nvm#installing-and-updating
  - Alternatively: https://nodejs.org/en/
- PostgreSQL
  - _Recommended_ to install via Docker image. Don't have to do anything special if you have Docker and run `npm run start:env`
  - Alternatively: https://www.postgresql.org/download/

## Scaffolding

- `npm run scaffold -- generate ModelNamePascalCase`

Follow a wizard to add properties with associated types. It will files for a new model/module. Mirrors structure of template found in `/template`
It is mostly a 1:1 mirror, but some things are a bit smarter - like generating a Sequelize migration

## Environment variables

You'll see a lot of files named something like `.env-*-example` These are so varied so as to support multiple dev flows:

- Running everything self-sufficiently with docker-compose
- Running tests self-sufficiently with docker-compose, while isolating from regular dev containers
- Running everything except server in docker, and then server locally - for debugging purposes
- Running in production

By running `npm run init` post-clone, all required env files will be generated from the examples. Do NOT commit any sensitive info to examples, and keep your
env files out of source control.
Do not import `dotenv/config`, we're already wrapping it. Import from `/config/load-config`

What follows is an explanation of various env files and variables. In the future, we might tidy this system up but it should be workable for now.

- .env
  - Avoid putting anything in here you don't have to. Currently contains only variables docker-compose needs to coordinate services
  - Reason why is that docker-compose reads `.env` and only `.env`, and we have some issues with variables leaking from that.
  - Removing the `volumes` section in `app` in `docker-compose` removes that need, but then rebuild on change doesn't work.
    - How the change detection inside docker works is that when run on dev machines, source files from the host are synced to those on the docker host
    - by a... let's call it a symbolic link (very wrong term to use).
- .env-e2e
  - For running integration tests. An entire infrastructure is spun up, tests run, and then spun down
  - Has different ports and host names for server, postgres and redis so as to isolate a bit more from others
- .env-handsoff
  - This is used when running `npm run start:handsoff` - when you want to run the whole infrastructure without doing anything other than that command
  - Has different ports and host names for server, postgres and redis so as to isolate a bit more from others
- .env-local
  - This is used by node service when running it locally without Docker (you can still use `npm run start:env` to start dependency services)
  - Has different ports and host names for server, postgres and redis so as to isolate a bit more from others

Set these environment variables prior to starting server. The first section is obligatory, others depending on project.

- `DB_LOGGING_ENABLED`: If set, query log from database will be enabled.
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_HOST`, `POSTGRES_PORT`: Postgres database connection parameters, default port is 5432 if not specified
- `LOG_LEVEL`: Logging level to use, defaults to info if not set. One of: 'trace', 'debug', 'info', 'warn', 'error', 'fatal'. Default is 'info'.
- `NODE_ENV` : Environment in which server is executed, ('dev'|'production').
- `NODE_PORT`: Port of the server, defaults to `3000`
- `SWAGGER_BASE_URL`: Base url for trying swagger api requests. Use public url of server where api is deployed. Default `localhost:${NODE_PORT}`
- `REDIS_HOST`, `REDIS_PORT`: Redis connection parameters

These often exist per project but depend on present modules

- `NEW_RELIC_APP_NAME`: Name of application. Default is `Default Application`
- `NEW_RELIC_LICENSE_KEY`: New Relic license key
- `NEW_RELIC_NO_CONFIG_FILE`: Must be set to `true`

- `AWS_ACCESS_KEY_ID`: AWS access key, needed for communicating with AWS services
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key, also needed for communicating with AWS services
- `S3_REGION`: Region of the S3 bucket responsible for application storage (us-east-2, us-west-1 etc.)
- `S3_BUCKET`: Name of the S3 bucket responsible for application storage
- `S3_URL_EXPIRATION_SECONDS`: Signed upload url time-to-live in seconds. Default `120` (2 minutes)

- `ACCESS_TOKEN_LIFETIME`: Access token time-to-live in seconds, defaults to `86400` (24 hours) if not set.
- `REFRESH_TOKEN_LIFETIME`: Refresh token time-to-live in seconds, defaults to `2592000` (30 days) if not set.
- `JWT_SECRET`: JWT secret used to produce and verify signatures.

- `SERVICES_APP_BACKEND`: Endpoint of app manager shoutem backend
- `SERVICES_LEGACY_BACKEND`: Endpoint of legacy v4 shoutem backend
- `SERVICES_API_TOKEN`: Service API token used for communication with shoutem backends

Environment variables for scheduler service:

- scheduler service variables

Environment variables for sequelize CLI (should already be covered by above):

- `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT` - database parameters for local environment

Project uses `dotenv` module to load env variables from various `.env` files from `/config`. Variables from `dotenv` should have lower priority than variables set from process through OS. Furthermore, we use `config/load-config` to wrap `dotenv` because `dotenv`
only supports absolute paths for env files which are not named `.env`

The reason we don't just use `.env` is that too many services default to that and it often causes conflicts when we want to support more than one dev flow.

## Database setup

If raising up db via docker-compose, skip this. Refer to `db.Dockerfile` and `init.sql` for more info.
If setting up database for shared environments - **obligatorily** follow below instructions.

1. Create empty PostgreSQL database
2. Add `btree_gist` extension to database logged in as admin with command: `CREATE EXTENSION btree_gist`
3. Add `pg_trgm` extension to database logged in as admin with command: `CREATE EXTENSION pg_trgm`
4. Create PostgreSQL user and assign it as owner to created database, or give him permission to modify all tables and data.

## Sequelize CLI

- `npm run migrate`

Execute pending DB migrations. It should be executed before after each model addition or change.

- `npm run migration:create -- --name <name>`

Creates new skeleton migration in `src/sequelize/migrations` folder.

For more commands available see https://github.com/sequelize/cli#usage

## Run service

_Development:_

### If you need backend services but don't need to debug them

If you don't have Docker yet, go back and get it.

```
npm run init
npm run start:handsoff
```

If server doesn't work after this, it might be errored. Just run whatever `npm run start:handsoff` runs, but without the option `-d` (detached).
If you get any errors related to database persisting, you might need to change your DB_PERSIST_PATH in .env

### If you are developing on backend, we recommend

If you don't have Docker yet, go back and get it.

```
npm run init
npm run start:env
npm run migrate
npm run start:debug:local
```

When you wish to debug with breakpoints etc., run vscode run configuration called `Attach`. See `/.vscode/launch.json`
The debugger should be open on port 9229 by default.
For other IDEs, figure it out and please add instructions to this document.

_Production:_

Old fashioned:

```
npm install
npm run migrate
npm run start
```

Dockerized:

```
build container somewhere and push it elsewhere
pull container from whatever registry
run it on target machine
npm run migrate // only once per deploy, no matter how many instances you have.
npm run start
```

## Editor configuration and linting

Editor configuration is contained in .editorconfig file which helps developers define and maintain consistent coding styles between different editors and IDEs. See more information on [EditorConfig website](http://editorconfig.org/).

Linting is done via [eslint](http://eslint.org/) using Five's [JavaScript style guide](https://github.com/5minutes/javascript).

## Prettier and linting

[Prettier](https://prettier.io/) is a code formatter which helps developers define and maintain consistent coding styles.
We use Prettier in combination with lint - we have configured them so that they play nicely with each other.

Why Prettier?

- You press save and code is formatted
- No need to discuss style in code review
- Saves you time and energy

To run Prettier on save:

- Webstorm setup: [Webstorm - Prettier](https://prettier.io/docs/en/webstorm.html#running-prettier-on-save-using-file-watcher)
- Visual studio code setup: [Visual studio code - Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Api docs

Api swagger specification is generated dynamically during server startup, and exposed as swagger doc on `<serverEndpoint>/swagger.json`

Also, Api explorer for generated specification is available on `<serverEndpoint>/api-docs`
If default port is used then, it is available on: http://localhost:3000/api-docs

## Learn more

- [ECMAScript 6 features](https://github.com/lukehoban/es6features) ([pretty print](https://babeljs.io/docs/learn-es2015/))
- [JSON API](https://jsonapi.org/)
- [Sequelize](http://docs.sequelizejs.com/)
