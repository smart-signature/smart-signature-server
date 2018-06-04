'use strict';

const env = process.env;

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1527505397586_5715';

  // add your config here
  config.middleware = [];

  const POSTGRES_DB_HOST = env.POSTGRES_DB_HOST || '';
  config.sequelize = {
    dialect: 'postgres',
    database: 'smart-signature-pro',
    host: POSTGRES_DB_HOST.split(':')[0] || 'localhost',
    port: POSTGRES_DB_HOST.split(':')[1] || '5432',
    username: env.POSTGRES_DB_USER || 'postgres',
    password: env.POSTGRES_DB_PASSWORD || 'postgres',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.smsVerify = {
    ttl: 10, // 验证码有效期（分钟）
    mock: env.SMS_MOCK, // 如果设置了mock，就不会真正去发短信
    provider: {
      type: 'yunpian',
      api: 'https://sms.yunpian.com/v2/sms/single_send.json',
      key: env.YUNPIAN_KEY || '<REPLACE_WITH_YOUR_KEY>',
      template: '【云片网】您的验证码是',
    },
  };

  config.passportSMS = {
    usernameField: 'mobile',
    passwordField: 'captcha',
  };

  config.masterKey = env.MASTER_KEY || '123456';

  return config;
};
