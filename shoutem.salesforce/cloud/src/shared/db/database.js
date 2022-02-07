import { Sequelize } from 'sequelize-typescript';
import pg from 'pg';
import config from './config/db';
import { logger } from '../logging';

// Set type parser for timestamp without timezone
const timestampOID = 1114;
const { types } = pg;
types.setTypeParser(timestampOID, (stringValue) => stringValue.replace(' ', 'T'));

export class Database {
  constructor() {
    this.sequelize = new Sequelize(config);
  }

  connect() {
    return this.sequelize.authenticate().then(() => {
      logger.info('Database connection has been established successfully.');
    });
  }

  getInstance() {
    return this.sequelize;
  }
}

export default new Database();
