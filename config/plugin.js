'use strict';

const path = require('path');

// had enabled by egg
// exports.static = true;
exports.sequelize = {
  enable: true,
  package: 'egg-sequelize',
};

exports.web3 = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-web3'),
};

exports.passport = {
  enable: true,
  package: 'egg-passport',
};

exports.userrole = {
  package: 'egg-userrole',
};

exports.passportWechat = {
  enable: true,
  path: path.join(__dirname, '../lib/plugin/egg-passport-wechat'),
};
