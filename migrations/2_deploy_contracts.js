const RaribleToken = artifacts.require('RaribleToken');

module.exports = function (deployer) {
  const NAME = 'a';
  const SYMBOL = 'a';
  const SIGNER_ADDRESS = '0x2e6d9aD80a79caB9940429026a52CD2a88A7f32c';
  const CONTRACT_URI = 'a';
  const TOKEN_URI_PREFIX = 'a';

  deployer.deploy(
    RaribleToken,
    NAME,
    SYMBOL,
    SIGNER_ADDRESS,
    CONTRACT_URI,
    TOKEN_URI_PREFIX
  );
};
