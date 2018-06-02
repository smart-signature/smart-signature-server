'use strict';

const Service = require('egg').Service;
const secp256k1 = require('secp256k1/elliptic');
const createKeccakHash = require('keccak');
const crypto = require('crypto');

class WalletService extends Service {

  async create() {
    const privateKey = crypto.randomBytes(32);
    const publicKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
    const address = createKeccakHash('keccak256').update(publicKey).digest()
      .slice(-20);

    const wallet = {
      digiccy: 'ETH',
      privateKey: privateKey.toString('hex'),
      address: '0x' + address.toString('hex'),
    };

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
      ctx.throw(404, 'wallet not found');
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
