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
      const { mobile, captcha } = user;
      const isValid = await ctx.service.sms.checkCaptcha({ mobile, captcha });

      if (!isValid) {
        ctx.throw('验证码不正确');
      }

      const existsUser = await ctx.service.user.find({ mobile });
      if (existsUser) return existsUser;

      const newUser = await ctx.service.user.create({ mobile });
      return newUser;
    }

    ctx.throw('无效的Passport Provider:' + user.provider, { user });
  });

  app.passport.serializeUser(async (ctx, user) => {
    return user;
  });

  app.passport.deserializeUser(async (ctx, user) => {
    return user;
  });
};

