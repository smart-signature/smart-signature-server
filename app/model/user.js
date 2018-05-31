'use strict';

module.exports = app => {
  const { STRING } = app.Sequelize;

  const User = app.model.define('user', {
    mobile: {
      type: STRING,
      primaryKey: true,
    },
  });

  return User;
};
