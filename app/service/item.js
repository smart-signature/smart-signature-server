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

  async get({ id }) {
    const ctx = this.ctx;

    const item = await ctx.model.Item.findOne({
      where: {
        id,
      },
    });

    if (!item) {
      ctx.throw(404, 'Item不存在', {
        code: 'ITEM_NOT_FOUND',
        errors: {
          id,
        },
      });
    }

    return item;
  }

  // 根据tx获取receipt，然后更新creator_address，contract_address，token_id
  async sync({ id }) {
    const ctx = this.ctx;
    const item = await this.get({ id });

    const tx = item.tx;
    const receipt = await ctx.web3.eth.getTransactionReceipt(tx);

    if (receipt) {
      const creator_address = receipt.from.toLowerCase();
      const contract_address = receipt.to.toLowerCase();
      const token_id = parseInt(receipt.logs[0].topics[1], 16);

      item.creator_address = creator_address;
      item.contract_address = contract_address;
      item.token_id = token_id;

      await item.save();
    }

    return item;
  }

  async like({ user_id, item_id, value }) {
    const ctx = this.ctx;

    const item = await this.get({ id: item_id });
    const digiccy = item.digiccy;
    const wallet = await ctx.service.wallet.get({ user_id, digiccy, status: 'normal' });
    const token_id = item.token_id;
    const referrer = '';

    const method = 'sponsor';
    const from = wallet.address;
    const to = item.contract_address;
    const args = [ token_id, referrer ];
    const privateKey = wallet.privateKey;

    const tx = await ctx.web3.callContract({
      value,
      method,
      from,
      to,
      privateKey,
      args,
    });

    return tx;
  }
}

module.exports = ItemService;
