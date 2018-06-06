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

    user_id: {
      type: INTEGER,
      allowNull: true,
      defaultValue: null,
    },

  });

  return Item;
};
