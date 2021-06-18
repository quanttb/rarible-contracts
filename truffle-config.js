const HDWalletProvider = require('@truffle/hdwallet-provider');

const fs = require('fs');
const privateKeys = [fs.readFileSync('.secret').toString().trim()];

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    bsc_testnet: {
      provider: () =>
        new HDWalletProvider(
          privateKeys,
          `https://data-seed-prebsc-1-s1.binance.org:8545`,
          0,
          1
        ),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    localhost: {
      provider: () =>
        new HDWalletProvider(privateKeys, `http://127.0.0.1:8545`, 0, 1),
      network_id: 1,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.5.17',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
