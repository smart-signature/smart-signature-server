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
    // TODO: 检查权限 只有本人 或者 管理员 才有权限
    // ctx.throw(403, '无权限修改用户信息', { code: 'FORBIDDEN_UPDATE_USER', error: { address } });
    const user = await ctx.service.user.updateByAddress(address, updates);
    ctx.body = user;
  }

  async createWallet() {
    const ctx = this.ctx;
    const user_id = ctx.params.id;

    // TODO: 检查权限 只有本人 或者 管理员 才有权限
    // ctx.throw(403, '无权限创建钱包', { code: 'FORBIDDEN_CREATE_WALLET', error: { user_id } });
    const { address } = await ctx.service.user.createWallet(user_id);
    ctx.body = { address };
  }

  async createLike() {
    const ctx = this.ctx;

    const to_address = ctx.params.address;
    const item_id = ctx.params.item_id;
    const { from_user_id, value, message, referrer } = ctx.request.body;

    // TODO: 检查权限 只有本人 或者 管理员 才有权限
    // ctx.throw();

    ctx.body = await ctx.service.user.createLike({
      from_user_id,
      to_address,
      item_id,
      value,
      message,
      referrer,
    });
  }
}

module.exports = UserController;
