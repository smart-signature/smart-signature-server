'use strict';

const Controller = require('egg').Controller;

class WalletController extends Controller {

  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.wallet.list(ctx.query);
  }

  async create() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.wallet.create();
  }

}

module.exports = WalletController;
