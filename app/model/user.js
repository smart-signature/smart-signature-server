'use strict';

module.exports = app => {
  const { STRING, ARRAY } = app.Sequelize;

  const User = app.model.define('user', {

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
