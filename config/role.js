'use strict';

module.exports = app => {
  app.role.use('user', ctx => !!ctx.user);

  app.role.failureHandler = (ctx, action) => {
    const message = 'Forbidden, required role: ' + action;
    ctx.throw(403, message);
  };
};
