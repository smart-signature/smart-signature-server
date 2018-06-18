'use strict';

const LocalStrategy = require('passport-local').Strategy;

module.exports = app => {
  const config = app.config.passportSMS || {};
  config.passReqToCallback = true;
  app.passport.use('sms', new LocalStrategy(config, (req, username, password, done) => {
    const user = {
      provider: 'sms',
      mobile: username,
      captcha: password,
    };
    app.passport.doVerify(req, user, done);
  }));

  app.passport.verify(async (ctx, user) => {
    let newUser;
    if (user.provider === 'sms') {
      const { mobile, captcha } = user;
      const isValid = await ctx.service.sms.checkCaptcha({ mobile, captcha });

      if (!isValid) {
        ctx.throw(400, '验证码不正确', { code: 'WRONG_CAPTCHA', errors: { mobile, captcha } });
      }

      const existsUser = await ctx.service.user.find({ mobile });
      if (existsUser) return existsUser;

      newUser = await ctx.service.user.create({ mobile });
    } else if (user.provider === 'wechat') {
      const wechatUser = {};
      [ 'openid', 'nickname', 'sex', 'city', 'province', 'country', 'headimgurl' ].forEach(key => {
        wechatUser['wechat_' + key] = user[key];
      });

      const wechat_openid = wechatUser.wechat_openid;
      const existsUser = await ctx.service.user.find({ wechat_openid });
      if (existsUser) return existsUser;
      newUser = await ctx.service.user.create(wechatUser);
    }

    if (newUser) {
      // 新的用户，自动帮用户申请绑定一个钱包
      ctx.service.wallet.request({ user_id: newUser.id, digiccy: 'ETH' });
      return newUser;
    }

    ctx.throw(500, '无效的Passport Provider:' + user.provider, { code: 'INVALID_PASSPORT_PROVIDER', errors: user });
  });

  app.passport.serializeUser(async (ctx, user) => {
    return user;
  });

  app.passport.deserializeUser(async (ctx, user) => {
    return user;
  });
};

