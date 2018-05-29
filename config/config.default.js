'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1527505397586_5715';

  // add your config here
  config.middleware = [];

  const POSTGRES_DB_HOST = process.env.POSTGRES_DB_HOST || '';
  config.sequelize = {
    dialect: 'postgres',
    database: 'smart-signature-pro',
    host: POSTGRES_DB_HOST.split(':')[0] || 'localhost',
    port: POSTGRES_DB_HOST.split(':')[1] || '5432',
    username: process.env.POSTGRES_DB_USER || 'postgres',
    password: process.env.POSTGRES_DB_PASSWORD || 'postgres',
  };

  return config;
};