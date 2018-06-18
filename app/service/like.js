'use strict';

const Service = require('egg').Service;

class LikeService extends Service {

  async create({ fromUserId, toUserId, itemId, value, digiccy, message }) {
    const ctx = this.ctx;

    const from_wallet = await ctx.service.wallet.get({
      user_id: fromUserId,
      digiccy,
    });

    const to_wallet = await ctx.service.wallet.get({
      user_id: toUserId,
      digiccy,
    });

    const from_address = from_wallet.address;
    const to_address = to_wallet.address;

    // TODO:  ctx.service.blockchain.createLike({from,to,value, digiccy})
    const tx_hash = '111'; // call contract to get tx_hash

    return this.ctx.model.Like.create({
      tx_hash,
      from_user_id: fromUserId,
      to_user_id: toUserId,
      from_address,
      to_address,
      item_id: itemId,
      value,
      digiccy,
      message,
    });
  }

  async list(query = {}) {
    const ctx = this.ctx;

    const limit = query.limit || 25;
    const offset = query.offset || 0;
    const where = {};

    if (query.toUserId !== undefined) {
      where.to_user_id = query.toUserId;
    }

    const option = {
      limit,
      offset,
      where,
      order: [[ 'updated_at', 'DESC' ]],
      include: [
        {
          model: ctx.model.User,
          as: 'fromUser',
        },
        {
          model: ctx.model.User,
          as: 'toUser',
        },
      ],
    };

    return ctx.model.Like.findAndCountAll(option);
  }
}

module.exports = LikeService;
