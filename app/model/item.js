'use strict';

module.exports = app => {
  const { STRING, ARRAY, INTEGER, DOUBLE } = app.Sequelize;

  const Item = app.model.define('item', {

    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    valueOptions: { // 赞赏快捷金额选项
      type: ARRAY(DOUBLE),
    },

    tx: { // transaction hash of created token
      type: STRING,
    },

    digiccy: {
      type: STRING, // 对应的币种
      allowNull: false,
    },

    contract_address: {
      type: STRING, // 合约地址
    },

    creator_address: {
      type: STRING, //  创建人地址
    },

    token_id: { // 在合约里的id
      type: INTEGER,
      allowNull: true,
      defaultValue: null,
    },

    user_id: {
      type: INTEGER,
      allowNull: true,
      defaultValue: null,
    },

  });

  return Item;
};
