'use strict';

module.exports = app => {
  const { STRING, INTEGER, BIGINT } = app.Sequelize;

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

    balance: {
      type: BIGINT,
      allowNull: false,
      defaultValue: 0,
    },

  });

  return Wallet;
};
