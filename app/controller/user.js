'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  async current() {
    const ctx = this.ctx;
    ctx.body = ctx.user;
  }

  async getUser() {
    const ctx = this.ctx;

    const address = ctx.params.address;
    const user = await ctx.service.user.getByAddress(address);

    ctx.body = user;
  }

}

module.exports = UserController;
