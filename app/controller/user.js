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

  async updateUser() {
    const ctx = this.ctx;

    const address = ctx.params.address;
    const updates = ctx.request.body;
    // TODO: 检查权限 只有本人 或者 管理员 才有权修改
    // ctx.throw(403, '无权限修改用户信息', { code: 'FORBIDDEN_UPDATE_USER', error: { address } });
    const user = await ctx.service.user.updateByAddress(address, updates);
    ctx.body = user;
  }

}

module.exports = UserController;
