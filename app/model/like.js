'use strict';

module.exports = app => {
  const { STRING, INTEGER, BIGINT } = app.Sequelize;

  const Like = app.model.define('like', {

    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    tx_hash: {
      type: STRING,
    },

    from_user_id: {
      type: INTEGER,
    },

    to_user_id: {
      type: INTEGER,
    },

    from_address: {
      type: STRING,
    },

    to_address: {
      type: STRING,
    },

    item_id: {
      type: INTEGER,
    },

    value: {
      type: BIGINT,
    },

    digiccy: {
      type: STRING,
    },

    message: {
      type: STRING,
    },

  });

  return Like;
};
