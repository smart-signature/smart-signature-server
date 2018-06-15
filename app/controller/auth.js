'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {

  async sendVerifySMS() {
    const ctx = this.ctx;
    const mobile = ctx.request.body.mobile;
    await ctx.service.sms.sendCaptcha(mobile);
    ctx.body = { mobile };
  }

  async loginOrRegister() {
    const ctx = this.ctx;
    const { mobile, captcha } = ctx.request.body;
    const isValid = await ctx.service.sms.checkCaptcha({ mobile, captcha });

    if (!isValid) {
      ctx.throw(400, '验证码不正确', { code: 'WRONG_CAPTCHA', errors: { mobile, captcha } });
    }

    let user = await ctx.service.user.find({ mobile });

    if (!user) {
      user = await ctx.service.user.create({ mobile });
    }

    ctx.body = user;
  }

  async logout() {
    const ctx = this.ctx;
    ctx.logout();
    ctx.body = {};
  }

  async loginByWechat() {
    const ctx = this.ctx;
    const redirect = ctx.query.redirect;
    ctx.session.wechat_login_redirect = redirect;
    ctx.redirect('/passport/wechat');
  }

  async wechatLoginSuccess() {
    const ctx = this.ctx;
    const redirect = ctx.session.wechat_login_redirect;
    // TODO: put redirect in security domain while list
    // Ref: https://github.com/eggjs/egg/blob/master/docs/source/en/core/security.md#prevention-4
    ctx.unsafeRedirect(redirect);
  }
}

module.exports = AuthController;
