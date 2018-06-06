'use strict';

const Service = require('egg').Service;

class ItemService extends Service {
  async create({ user_id, ponzi, valueOptions }) {
    const ctx = this.ctx;

    const digiccy = 'ETH';
    const wallet = await ctx.model.Wallet.findOne({
      where: {
        user_id,
        digiccy,
        status: 'normal',
      },
    });

    if (!wallet) {
      ctx.throw(400, '用户没有' + digiccy + '钱包', {
        code: 'USER_NO_WALLET',
        errors: {
          user_id,
          digiccy,
        },
      });
    }

    const method = 'create';
    const from = wallet.address;
    const to = ctx.app.config.contract;
    const args = [ ponzi ];
    const privateKey = wallet.privateKey;

    const tx = await ctx.web3.callContract({
      method,
      from,
      to,
      privateKey,
      args,
    });

    return this.ctx.model.Item.create({
      tx,
      user_id,
      valueOptions,
    });
  }
}

module.exports = ItemService;
