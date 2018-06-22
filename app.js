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
    if (user.provider === 'sms') {
      return await ctx.service.user.loginBySMS(user);
    } else if (user.provider === 'wechat') {
      return await ctx.service.user.loginByWechat(user);
    }
    ctx.throw(500, '无效的Passport Provider:' + user.provider, { code: 'INVALID_PASSPORT_PROVIDER', errors: user });
  });

  app.passport.serializeUser(async (ctx, user) => {
    return user.get(); // get() can get full data, toJSON() only returns non sensitive data
  });

  app.passport.deserializeUser(async (ctx, user) => {
    return user;
  });
};

