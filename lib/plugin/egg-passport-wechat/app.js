'use strict';

const debug = require('debug')('egg-passport-wechat');
const assert = require('assert');
const Strategy = require('passport-weixin');

module.exports = app => {
  const config = app.config.passportWechat;
  config.passReqToCallback = true;
  assert(config.key, '[egg-passport-wechat] config.passportWechat.key required');
  assert(config.secret, '[egg-passport-wechat] config.passportWechat.secret required');
  config.clientID = config.key;
  config.clientSecret = config.secret;

  // must require `req` params
  app.passport.use('wechat', new Strategy(config, (req, accessToken, refreshToken, params, profile, done) => {
    // format user
    const { openid, nickname, sex, language, city, province, country, headimgurl, privilege } = profile._json;

    const user = {
      provider: 'wechat',
      openid,
      nickname,
      sex,
      language,
      city,
      province,
      country,
      headimgurl,
      privilege,
      params,
    };

    debug('%s %s get user: %j', req.method, req.url, user);

    // let passport do verify and call verify hook
    app.passport.doVerify(req, user, done);
  }));
};
