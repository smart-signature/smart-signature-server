'use strict';

const Service = require('egg').Service;

class UserService extends Service {

  async create(user) {
    return this.ctx.model.User.create(user);
  }

  async getByAddress(address) {
    // TODO: 检查address是否合法
    // ctx.throw(400, '无效地址', { code: 'INVALID_ADDRESS', error: { address } });

    // 从数据库里读取用户信息
    let userInDB = await this.ctx.model.User.find({ where: { address } });
    userInDB = userInDB ? userInDB.toJSON() : userInDB;

    // TODO：从合约里读取用户信息
    const userInChain = {
      send_likes_count: 0, //累计发出打赏次数
      send_likes_value: 0, //累计发出打赏的总金额
      send_likes_to_users_count: 0,  //累计打赏了多少位用户
      receive_likes_count: 0, //累计收到的打赏次数
      receive_likes_value: 0, //累计收到打赏的总金额
      receive_likes_from_users_count: 0, //累计收到了多少位用户的打赏
      balance: 0, //账户余额
    };

    return { ...userInDB, ...userInChain };
  }

}

module.exports = UserService;
