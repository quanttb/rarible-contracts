const HDWalletProvider = require('@truffle/hdwallet-provider');

const {
  PRIVATE_KEY,
  BSCSCAN_API_KEY,
  ETHERSCAN_API_KEY,
  INFURA_KEY,
} = require('./env.json');

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    bsc_testnet: {
      provider: () =>
        new HDWalletProvider(
          [PRIVATE_KEY],
          'https://data-seed-prebsc-1-s1.binance.org:8545',
          0,
          1
        ),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider(
          [PRIVATE_KEY],
          `https://ropsten.infura.io/v3/${INFURA_KEY}`,
          0,
          1
        ),
      network_id: 3,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          [PRIVATE_KEY],
          `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
          0,
          1
        ),
      network_id: 4,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  mocha: {
    timeout: 10000,
  },

  compilers: {
    solc: {
      version: '0.7.6',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: 'istanbul',
      },
    },
  },

  plugins: ['truffle-plugin-verify'],

  api_keys: {
    etherscan: ETHERSCAN_API_KEY,
    bscscan: BSCSCAN_API_KEY,
  },
};
