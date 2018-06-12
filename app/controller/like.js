'use strict';

const Controller = require('egg').Controller;

class LikeController extends Controller {
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
