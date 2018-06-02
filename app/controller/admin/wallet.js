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

  async dropToken() {
    const ctx = this.ctx;
    const { address } = ctx.request.body;
    this.ctx.body = await ctx.curl('http://faucet.ropsten.be:3001/donate/' + address, {
      dataType: 'json',
    });
  }

  async syncBalance() {
    const ctx = this.ctx;
    const { address } = ctx.request.body;
    ctx.body = await ctx.service.wallet.syncBalance(address);
  }

}

module.exports = WalletController;
