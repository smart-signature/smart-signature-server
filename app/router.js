'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.post('/sendVerifySMS', controller.auth.sendVerifySMS);
  router.post('/loginOrRegister', controller.auth.loginOrRegister);
  router.get('/logout', controller.auth.logout);
  router.post('/passport/sms', app.passport.authenticate('sms', { successRedirect: '/user' }));

  router.post('/admin/db/reset', controller.admin.db.reset);
  router.post('/admin/wallets/dropToken', controller.admin.wallet.dropToken);
  router.post('/admin/wallets/syncBalance', controller.admin.wallet.syncBalance);
  router.resources('wallets', '/admin/wallets', controller.admin.wallet);

  router.get('/user', controller.user.current);
};
