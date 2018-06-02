'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Wallet = app.model.define('wallet', {

    user_id: INTEGER,

    digiccy: {
      type: STRING,
      allowNull: false,
    },

    status: {
      type: STRING,
      allowNull: false,
      defaultValue: 'empty',
    },

    address: {
      type: STRING,
      allowNull: false,
    },

    privateKey: {
      type: STRING,
      allowNull: false,
    },

  });

  return Wallet;
};
