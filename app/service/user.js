'use strict';

const Service = require('egg').Service;
const secp256k1 = require('secp256k1/elliptic');
const createKeccakHash = require('keccak');
const crypto = require('crypto');
class UserService extends Service {

  async create(user) {
    return this.ctx.model.User.create(user);
  }

  // 短信验证码登录
  async loginBySMS({ mobile, captcha }) {
    const ctx = this.ctx;

    const isValid = await ctx.service.sms.checkCaptcha({ mobile, captcha });
    if (!isValid) {
      ctx.throw(400, '验证码不正确', { code: 'WRONG_CAPTCHA', errors: { mobile, captcha } });
    }

    const exist_user = await ctx.model.User.find({ where: { mobile } });
    if (exist_user) return exist_user;

    return ctx.model.User.create({ mobile });
  }

  // 微信登录
  async loginByWechat(info) {
    const ctx = this.ctx;

    const wechat_info = {};
    [ 'openid', 'nickname', 'sex', 'city', 'province', 'country', 'headimgurl' ].forEach(key => {
      wechat_info['wechat_' + key] = info[key];
    });
    const exist_user = await ctx.model.User.find({ where: { wechat_openid: wechat_info.wechat_openid } });
    let user;

    if (exist_user) {
      // 更新微信的相关资料
      user = await exist_user.update(wechat_info);
    } else { // 首次登录，创建新用户
      user = await ctx.model.User.create(wechat_info);
    }

    return user;
  }

  async getByAddress(address) {
    // TODO: address统一变小写，检查address是否合法
    // ctx.throw(400, '无效地址', { code: 'INVALID_ADDRESS', error: { address } });

    // 从数据库里读取用户信息
    let userInDB = await this.ctx.model.User.find({ where: { address } });
    userInDB = userInDB ? userInDB.toJSON() : userInDB;

    // TODO：从合约里读取用户信息
    const userInChain = {
      send_likes_count: 0, // 累计发出打赏次数
      send_likes_value: 0, // 累计发出打赏的总金额
      send_likes_to_users_count: 0, // 累计打赏了多少位用户
      receive_likes_count: 0, // 累计收到的打赏次数
      receive_likes_value: 0, // 累计收到打赏的总金额
      receive_likes_from_users_count: 0, // 累计收到了多少位用户的打赏
      balance: 0, // 账户余额
    };

    return Object.assign({}, userInDB, userInChain);
  }

  async updateByAddress(address, updates) {
    const ctx = this.ctx;
    // TODO: address统一变小写，检查address是否合法
    // ctx.throw(400, '无效地址', { code: 'INVALID_ADDRESS', error: { address } });

    const user = await this.ctx.model.User.find({ where: { address } });
    if (!user) {
      ctx.throw(404, `地址（address: ${address})的用户不存在`, { code: 'USER_NOT_FOUND', errors: { address } });
    }

    // 检查更新参数是否合法
    const illegal = Object.keys(updates).some(key => {
      return ![ 'nickname', 'bio', 'avatar_url' ].includes(key);
    });
    if (illegal) {
      ctx.throw(400, '更新用户信息参数错误', { code: 'ILLEGAL_UPDATE_USER_PRAM', errors: { address, updates } });
    }

    await user.update(updates);
    return this.getByAddress(address);
  }

  // 创建钱包
  async createWallet(user_id) {
    const ctx = this.ctx;

    const user = await ctx.model.User.find({ where: { id: user_id } });
    if (!user) {
      ctx.throw(400, `用户(id: ${user_id})不存在`, { code: 'USER_NOT_FOUND', errors: { user_id } });
    }
    if (user.address) {
      ctx.throw(400, `用户(id: ${user_id})已有钱包，无法创建新的`, { code: 'USER_ALREADY_HAS_WALLET', errors: { user_id, address: user.address } });
    }

    let private_key = crypto.randomBytes(32);
    const publicKey = secp256k1.publicKeyCreate(private_key, false).slice(1);
    let address = createKeccakHash('keccak256').update(publicKey).digest()
      .slice(-20);
    private_key = private_key.toString('hex').toLowerCase();
    address = '0x' + address.toString('hex').toLowerCase();

    await ctx.model.User.update({
      address,
      private_key,
    }, {
      where: {
        id: user_id,
        address: null, // 如果同一个用户高并发打过来，可能会被更新多次, 所以不要用user.updates({address,private_key˜})
        private_key: null,
      },
      returning: true,
    });

    return {
      address,
      private_key,
    };
  }

  // 创建一个打赏
  async createLike({ from_user_id, to_address, item_id, value, message, referrer }) {
    const ctx = this.ctx;

    const from_user = await ctx.model.User.find({ where: { id: from_user_id } });
    if (!from_user) {
      ctx.throw(400, `用户(id: ${from_user_id})不存在`, { code: 'USER_NOT_FOUND', errors: { from_user_id } });
    }
    if (!from_user.address || !from_user.private_key) {
      ctx.throw(400, `用户(id: ${from_user_id})没有钱包`, { code: 'USER_HAS_NO_WALLET', errors: { from_user_id } });
    }

    const tx_hash = await ctx.web3.callContract({
      value,
      method: 'like',
      from: from_user.address,
      to: ctx.app.config.blockchain.contract_address,
      privateKey: from_user.private_key,
      args: [ from_user.address, to_address, item_id, message, referrer ],
    });

    return { tx_hash, tx_link: ctx.app.config.blockchain.etherscan_host + '/tx/' + tx_hash };
  }
}

module.exports = UserService;
