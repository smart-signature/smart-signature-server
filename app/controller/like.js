'use strict';

const Controller = require('egg').Controller;

class LikeController extends Controller {
  async create() {
    const ctx = this.ctx;

    const fromUserId = ctx.user.id;
    const { toUserId, itemId = 0, value, digiccy = 'ETH', message = '' } = ctx.request.body;

    ctx.body = await ctx.service.like.create({
      fromUserId,
      toUserId,
      itemId,
      value,
      digiccy,
      message,
    });
  }

  async list() {
    const ctx = this.ctx;
    const { toUserId } = ctx.query;
    ctx.body = await ctx.service.like.list({ toUserId });
  }
}

module.exports = LikeController;
