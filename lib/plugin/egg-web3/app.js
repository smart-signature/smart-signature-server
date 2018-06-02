'use strict';

const assert = require('assert');
const Web3 = require('web3');
const Promise = require('bluebird');

module.exports = app => {
  app.addSingleton('web3', createOneClient);
};

function createOneClient(config) {
  assert(config.rpc, `[egg-web3] 'rpc: ${config.rpc} are required on config`);

  const web3 = new Web3(new Web3.providers.HttpProvider(config.rpc));

  web3.eth.getBalance = Promise.promisify(web3.eth.getBalance);

  return web3;
}
