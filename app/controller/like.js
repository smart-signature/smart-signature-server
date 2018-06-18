'use strict';

const Controller = require('egg').Controller;

class LikeController extends Controller {
  async create() {
    const ctx = this.ctx;

    const from_user_id = ctx.user.id;
    const { to_user_id, value, message, item_id, digiccy } = ctx.request.body;

    ctx.body = await ctx.service.like.create({
      from_user_id,
      to_user_id,
      item_id,
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
