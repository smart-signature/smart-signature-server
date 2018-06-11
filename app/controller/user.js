'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  async current() {
    const ctx = this.ctx;
    ctx.body = ctx.user;
  }

  async getUser() {
    const ctx = this.ctx;

    const user_id = ctx.params.user_id;
    const user = await ctx.service.user.find({ id: user_id });
    if (!user) {
      ctx.throw(404, `用户（id：${user_id}不存在`, { code: 'USER_NOT_FOUND', error: { user_id } });
    }

    const { id, wechat_nickname, wechat_sex, wechat_headimgurl, wechat_country, wechat_province, wechat_city } = user;
    ctx.body = {
      id,
      wechat_nickname,
      wechat_sex,
      wechat_headimgurl,
      wechat_country,
      wechat_province,
      wechat_city,
      bio: null,
    };
  }

}

module.exports = UserController;
