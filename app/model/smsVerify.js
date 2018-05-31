'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const SMSVerify = app.model.define('smsVerify', {

    mobile: {
      type: STRING,
      allowNull: false,
    },

    captcha: {
      type: STRING,
      allowNull: false,
    },

  });

  return SMSVerify;
};
