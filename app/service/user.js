'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async create(user) {
    return this.ctx.model.User.create(user);
  }

  async find({ mobile }) {
    return this.ctx.model.User.find({ where: { mobile } });
  }

}

module.exports = UserService;
