'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async resetDB() {
    await this.ctx.app.model.sync({ force: true });
    this.ctx.body = {
      message: '重置数据库成功',
    };
  }
}

module.exports = AdminController;
