'use strict';

module.exports = app => {
  const { STRING, ARRAY, INTEGER } = app.Sequelize;

  const User = app.model.define('user', {

    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    mobile: {
      type: STRING,
      primaryKey: true,
    },

    roles: {
      type: ARRAY(STRING),
      defaultValue: [ 'user' ],
    },

  });

  return User;
};
