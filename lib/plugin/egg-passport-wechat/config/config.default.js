'use strict';

exports.passportWechat = {
  key: '',
  secret: '',
  callbackURL: '/passport/wechat/callback',
  requireState: false,
  authorizationURL: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  scope: 'snsapi_userinfo',
};
