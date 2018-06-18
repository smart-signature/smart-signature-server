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
}

module.exports = LikeService;
