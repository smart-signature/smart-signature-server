'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async create(user) {
    return this.ctx.model.User.create(user);
  }

  async find(where) {
    return this.ctx.model.User.find({ where });
  }

}

module.exports = UserService;
