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

    tx_status: {
      type: STRING, // Pending, Successful and Failed.
    },

  });

  Like.associate = function() {
    app.model.Like.belongsTo(app.model.User, {
      foreignKey: 'from_user_id',
      as: 'fromUser',
    });

    app.model.Like.belongsTo(app.model.User, {
      foreignKey: 'to_user_id',
      as: 'toUser',
    });
  };

  return Like;
};
