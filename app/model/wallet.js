'use strict';

module.exports = app => {
  const { STRING, INTEGER, BIGINT } = app.Sequelize;

  const Wallet = app.model.define('wallet', {

    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: INTEGER,
      allowNull: true,
      defaultValue: null,
    },

    digiccy: {
      type: STRING,
      allowNull: false,
    },

    status: {
      type: STRING,
      allowNull: false,
      defaultValue: 'new',
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

  }, {
    indexes: [
      {
        unique: true,
        fields: [ 'user_id', 'digiccy' ], // 用户每种币，只能有一个地址
      },
    ],
  });

  return Wallet;
};
