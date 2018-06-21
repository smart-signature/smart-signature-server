'use strict';

module.exports = app => {
  const { STRING, ARRAY, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {

    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    address: {
      type: STRING,
    },

    private_key: {
      type: STRING,
    },

    roles: {
      type: ARRAY(STRING),
      defaultValue: [ 'user' ],
    },

    mobile: {
      type: STRING,
    },

    password: {
      type: STRING,
    },

    nickname: {
      type: STRING,
    },

    bio: {
      type: STRING,
    },

    avatar_url: {
      type: STRING,
    },

    gender: {
      type: STRING,
    },

    location: {
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

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    [ 'roles', 'mobile', 'password', 'wechat_openid', 'private_key' ].forEach(key => {
      delete values[key];
    });
    return values;
  };

  return User;
};
