'use strict';

const Service = require('egg').Service;
const secp256k1 = require('secp256k1/elliptic');
const createKeccakHash = require('keccak');
const crypto = require('crypto');

class WalletService extends Service {

  async get({ user_id, digiccy = 'ETH', status = 'normal' }) {
    const ctx = this.ctx;

    const wallet = await ctx.model.Wallet.findOne({
      where: {
        user_id,
        digiccy,
        status,
      },
    });

    if (!wallet) {
      ctx.throw(400, '用户没有' + digiccy + '钱包', {
        code: 'USER_NO_WALLET',
        errors: {
          user_id,
          digiccy,
        },
      });
    }

    return wallet;
  }

  // 给user_id分配一个digiccy可用的钱包
  async request({ user_id, digiccy }) {
    const ctx = this.ctx;

    // 用户已经有了，就不再给他了
    const existsWallet = await ctx.model.Wallet.find({ where: { digiccy, user_id } });
    if (existsWallet) return existsWallet;

    const wallet = await ctx.model.Wallet.findOne({
      where: {
        user_id: null,
        digiccy,
        status: 'normal',
      },
    });

    if (!wallet) {
      ctx.throw(500, '可用钱包库存不足', { code: 'INSUFFICIENT_WALLET', errors: { user_id, digiccy } });
    }

    const [ count, wallets ] = await ctx.model.Wallet.update({
      user_id,
    }, {
      where: {
        id: wallet.id,
        user_id: null, // 多人并发请求时，可能会出现多人抢同一个wallet，所以update时，再check一下是否没被人占用
      },
      returning: true,
    });

    if (count === 0) {
      ctx.throw(500, '可用钱包库存不足', { code: 'INSUFFICIENT_WALLET', errors: { user_id, digiccy } });
    }

    return wallets[0];
  }

  async create({ user_id, digiccy = 'ETH', status = 'normal' }) {
    const privateKey = crypto.randomBytes(32);
    const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
    const address = createKeccakHash('keccak256').update(publicKey).digest()
      .slice(-20);

    const wallet = {
      status,
      digiccy,
      privateKey: privateKey.toString('hex').toLowerCase(),
      address: '0x' + address.toString('hex').toLowerCase(),
    };

    if (user_id !== undefined) {
      wallet.user_id = user_id;
    }

    return this.ctx.model.Wallet.create(wallet);
  }

  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }) {
    return this.ctx.model.Wallet.findAndCountAll({
      offset,
      limit,
      order: [[ order_by, order.toUpperCase() ]],
    });
  }

  async dropToken({ address }) {
    const ctx = this.ctx;
    return await ctx.curl('http://faucet.ropsten.be:3001/donate/' + address);
  }

  async syncBalance(address) {
    const ctx = this.ctx;

    const wallet = await ctx.model.Wallet.find({ where: { address } });
    if (!wallet) {
      ctx.throw(404, '钱包不存在', { code: 'WALLET_NOT_FOUND', errors: { address } });
    }

    let balance = await ctx.web3.eth.getBalance(address);
    balance = balance.toString();

    if (balance !== wallet.balance) {
      wallet.balance = balance;
      await wallet.save();
    }

    return wallet;
  }

}

module.exports = WalletService;
