'use strict';

const assert = require('assert');
const Web3 = require('web3');
const Promise = require('bluebird');
const Tx = require('ethereumjs-tx');

module.exports = app => {
  app.addSingleton('web3', createOneClient);
};

function createOneClient(config) {
  assert(config.rpc, `[egg-web3] 'rpc: ${config.rpc} are required on config`);

  const web3 = new Web3(new Web3.providers.HttpProvider(config.rpc));

  web3._contractCache = {};

  web3.eth.getBalance = Promise.promisify(web3.eth.getBalance);
  web3.eth.getTransactionCount = Promise.promisify(web3.eth.getTransactionCount);
  web3.eth.sendRawTransaction = Promise.promisify(web3.eth.sendRawTransaction);

  web3.callContract = async ({
    to,
    method,
    from,
    value = 0,
    gasPrice = 1000000000 * 100,
    gasLimit = 220002,
    privateKey,
    args,
  }) => {
    let contract = web3._contractCache[to];

    if (!contract) {
      const url = `${config.etherscan}/api?module=contract&action=getabi&address=${to}`;
      const res = await app.curl(url, {
        dataType: 'json',
      });
      const abi = JSON.parse(res.data.result);
      contract = web3.eth.contract(abi).at(to);
      web3._contractCache[to] = contract;
    }

    const data = contract[method].getData(...args);
    const nonce = await web3.eth.getTransactionCount(from);

    const rawTx = {
      nonce,
      gasPrice,
      from,
      gasLimit,
      to,
      value,
      data,
    };

    const tx = new Tx(rawTx);
    tx.sign(new Buffer(privateKey, 'hex'));
    const txHash = await web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'));
    return txHash;
  };

  return web3;
}
