const RaribleToken = artifacts.require('RaribleToken');

module.exports = function (deployer) {
  const NAME = 'NFTtify';
  const SYMBOL = 'NFTtify';
  const SIGNER_ADDRESS = '0x2e6d9aD80a79caB9940429026a52CD2a88A7f32c';
  const CONTRACT_URI = 'https://api-mainnet.rarible.com/contractMetadata/{address}';
  const TOKEN_URI_PREFIX = 'ipfs:/';

  deployer.deploy(
    RaribleToken,
    NAME,
    SYMBOL,
    SIGNER_ADDRESS,
    CONTRACT_URI,
    TOKEN_URI_PREFIX
  );
};
