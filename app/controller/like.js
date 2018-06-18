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
    // TODO: remove mock
    ctx.body = {
      total: 123,
      list: [{
        id: 1,
        avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJvbmjxQ5m7JyTXFhf0HEVJgC4IHSuhUOFseI2rMoAqtQ9aACohkYINm50OM4icU4tiaKw8hTu8ZmlQ/132',
      }, {
        id: 2,
        avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEJvbmjxQ5m7JyTXFhf0HEVJgC4IHSuhUOFseI2rMoAqtQ9aACohkYINm50OM4icU4tiaKw8hTu8ZmlQ/132',
      }],
    };
  }
}

module.exports = LikeController;
