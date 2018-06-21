'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const isUser = app.role.can('user');
  const isAdmin = app.role.can('admin');

  const passportWechat = app.passport.authenticate('wechat', { successRedirect: '/login/wechat/success' });

  router.get('/', controller.home.index);
  router.post('/sendVerifySMS', controller.auth.sendVerifySMS);
  router.post('/loginOrRegister', controller.auth.loginOrRegister);
  router.get('/logout', controller.auth.logout);

  router.post('/passport/sms', app.passport.authenticate('sms', { successRedirect: '/user' }));
  router.get('/login/wechat', controller.auth.loginByWechat);
  router.get('/login/wechat/success', controller.auth.wechatLoginSuccess);
  router.get('/passport/wechat', passportWechat);
  router.get('/passport/wechat/callback', passportWechat);

  router.patch('/wallets/request', isUser, controller.wallet.request);

  router.post('/admin/db/reset', isAdmin, controller.admin.db.reset);
  router.post('/admin/wallets/dropToken', isAdmin, controller.admin.wallet.dropToken);
  router.post('/admin/wallets/syncBalance', isAdmin, controller.admin.wallet.syncBalance);
  router.resources('wallets', '/admin/wallets', isAdmin, controller.admin.wallet);

  router.post('/items', isUser, controller.item.create);
  router.post('/items/:id/sync', controller.item.sync);
  router.post('/items/:id/like', isUser, controller.item.like);

  router.get('/user', isUser, controller.user.current);
  router.get('/users/:address', controller.user.getUser);

  router.get('/likes', controller.like.list);
  router.post('/likes', isUser, controller.like.create);
};
