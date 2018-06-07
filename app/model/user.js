'use strict';

module.exports = app => {
  const { STRING, ARRAY, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {

    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    roles: {
      type: ARRAY(STRING),
      defaultValue: [ 'user' ],
    },

    mobile: {
      type: STRING,
    },

    wechat_openid: {
      type: STRING,
    },

    wechat_nickname: {
      type: STRING,
    },

    wechat_sex: {
      type: INTEGER,
    },

    wechat_headimgurl: {
      type: STRING,
    },

    wechat_country: {
      type: STRING,
    },

    wechat_province: {
      type: STRING,
    },

    wechat_city: {
      type: STRING,
    },

  });

  return User;
};
