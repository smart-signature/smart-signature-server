'use strict';

const Controller = require('egg').Controller;

class WalletController extends Controller {

  // 用户可以对每个币种，申请一个我们的官方钱包
  async request() {
    const ctx = this.ctx;
    const user = ctx.user;
    const { digiccy } = ctx.request.body;

    ctx.body = await ctx.service.wallet.request({
      user_id: user.id,
      digiccy,
    });
  }
}

module.exports = WalletController;
