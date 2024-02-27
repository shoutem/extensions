import Sequelize from 'sequelize';
import _ from 'lodash';
import fs from 'fs';
import { requireEnvString, requireEnvBoolean } from '../../env';

const config = {
  username: requireEnvString('POSTGRES_USER'),
  password: requireEnvString('POSTGRES_PASSWORD'),
  database: requireEnvString('POSTGRES_DB'),
  dialect: 'postgres',
  dialectOptions: {
    ssl: requireEnvBoolean('DB_USE_SSL', false) ? { rejectUnauthorized: true } : undefined,
  },
  protocol: 'postgres',
  host: requireEnvString('POSTGRES_HOST'),
  port: requireEnvString('POSTGRES_PORT', '5432'),
  logging: requireEnvBoolean('DB_LOGGING_ENABLED', false),
  operatorsAliases: {
    $eq: Sequelize.Op.eq,
    $ne: Sequelize.Op.ne,
    $gte: Sequelize.Op.gte,
    $gt: Sequelize.Op.gt,
    $lte: Sequelize.Op.lte,
    $lt: Sequelize.Op.lt,
    $not: Sequelize.Op.not,
    $in: Sequelize.Op.in,
    $notIn: Sequelize.Op.notIn,
    $is: Sequelize.Op.is,
    $like: Sequelize.Op.like,
    $notLike: Sequelize.Op.notLike,
    $iLike: Sequelize.Op.iLike,
    $notILike: Sequelize.Op.notILike,
    $regexp: Sequelize.Op.regexp,
    $notRegexp: Sequelize.Op.notRegexp,
    $iRegexp: Sequelize.Op.iRegexp,
    $notIRegexp: Sequelize.Op.notIRegexp,
    $between: Sequelize.Op.between,
    $notBetween: Sequelize.Op.notBetween,
    $overlap: Sequelize.Op.overlap,
    $contains: Sequelize.Op.contains,
    $contained: Sequelize.Op.contained,
    $adjacent: Sequelize.Op.adjacent,
    $strictLeft: Sequelize.Op.strictLeft,
    $strictRight: Sequelize.Op.strictRight,
    $noExtendRight: Sequelize.Op.noExtendRight,
    $noExtendLeft: Sequelize.Op.noExtendLeft,
    $and: Sequelize.Op.and,
    $or: Sequelize.Op.or,
    $any: Sequelize.Op.any,
    $all: Sequelize.Op.all,
    $values: Sequelize.Op.values,
    $col: Sequelize.Op.col,
  },
};

if (_.isObject(config.dialectOptions.ssl)) {
  const rdsCertificates = fs.readFileSync(`${__dirname}/rds-combined-ca-bundle.pem`);
  config.dialectOptions.ssl.ca = [rdsCertificates];
}

export default config;
