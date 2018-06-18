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
    let message,
      code,
      httpStatus;

    if (action === 'user') {
      httpStatus = 401; // 未登录
      code = 'UNAUTHORIZED';
      message = 'Unauthorized';
    } else {
      httpStatus = 403; // 已登录，但是权限不够
      code = 'FORBIDDEN';
      message = 'Forbidden, required role: ' + action;
    }

    ctx.throw(httpStatus, message, { code, errors: { action } });
  };
};

