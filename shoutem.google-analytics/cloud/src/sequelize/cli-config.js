// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../shared/db/config/db');

const configsByEnv = {
  current: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    dialectOptions: config.default.dialectOptions,
  },
  local: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    dialectOptions: config.default.dialectOptions,
  },
  dev: {
    username: process.env.POSTGRES_USER_DEV,
    password: process.env.POSTGRES_PASSWORD_DEV,
    database: process.env.POSTGRES_DB_DEV,
    host: process.env.POSTGRES_HOST_DEV,
    port: process.env.POSTGRES_PORT_DEV,
    dialect: 'postgres',
    dialectOptions: config.default.dialectOptions,
  },
  qa: {
    username: process.env.POSTGRES_USER_QA,
    password: process.env.POSTGRES_PASSWORD_QA,
    database: process.env.POSTGRES_DB_QA,
    host: process.env.POSTGRES_HOST_QA,
    port: process.env.POSTGRES_PORT_QA,
    dialect: 'postgres',
    dialectOptions: config.default.dialectOptions,
  },
};

module.exports = configsByEnv;
