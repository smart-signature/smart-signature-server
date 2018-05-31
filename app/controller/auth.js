'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {

  async sendVerifySMS() {
    const ctx = this.ctx;
    const mobile = ctx.request.body.mobile;
    await ctx.service.sms.sendCaptcha(mobile);
    ctx.body = { mobile };
  }

}

module.exports = AuthController;
