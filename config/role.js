'use strict';

module.exports = app => {
  app.role.use('user', ctx => {
    return ctx.user && ctx.user.roles.includes('user');
  });

  app.role.use('admin', ctx => {
    const body = ctx.request.body;
    if (body && ctx.app.config.masterKey === body.masterKey) {
      return true;
    }

    return ctx.user && ctx.user.roles.includes('admin');
  });

  app.role.failureHandler = (ctx, action) => {
    const message = 'Forbidden, required role: ' + action;
    ctx.throw(403, message, { code: 'FORBIDDEN', errors: { action } });
  };
};

