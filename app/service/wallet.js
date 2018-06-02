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

}

module.exports = WalletService;
