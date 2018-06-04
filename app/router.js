'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  const isUser = app.role.can('user');
  const isAdmin = app.role.can('admin');

  router.get('/', controller.home.index);
  router.post('/sendVerifySMS', controller.auth.sendVerifySMS);
  router.post('/loginOrRegister', controller.auth.loginOrRegister);
  router.get('/logout', controller.auth.logout);
  router.post('/passport/sms', app.passport.authenticate('sms', { successRedirect: '/user' }));

  router.post('/admin/db/reset', isAdmin, controller.admin.db.reset);
  router.post('/admin/wallets/dropToken', isAdmin, controller.admin.wallet.dropToken);
  router.post('/admin/wallets/syncBalance', isAdmin, controller.admin.wallet.syncBalance);
  router.resources('wallets', '/admin/wallets', isAdmin, controller.admin.wallet);

  router.get('/user', isUser, controller.user.current);
};
