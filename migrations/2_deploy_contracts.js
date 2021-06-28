// ERC-721
const MintableToken = artifacts.require('MintableToken');
// ERC-1155
const RaribleToken = artifacts.require('RaribleToken');
const WETH = artifacts.require('WETH');
const TransferProxy = artifacts.require('TransferProxy');
const TransferProxyForDeprecated = artifacts.require(
  'TransferProxyForDeprecated'
);
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');
const ExchangeStateV1 = artifacts.require('ExchangeStateV1');
const ExchangeOrdersHolderV1 = artifacts.require('ExchangeOrdersHolderV1');
const ExchangeV1 = artifacts.require('ExchangeV1');

module.exports = async function (deployer) {
  const NAME = 'Tokenplay Token';
  const SYMBOL = 'TOP';
  const SIGNER_ADDRESS = '0xd6e323D7215EA5349A7B83CA3c4B415993fEF960';
  const BENEFICIARY_ADDRESS = '0x9c3D7e0B53024147ef7966247d6BB61E60aCb200';
  const BUYER_FEE_SIGNER_ADDRESS = '0xd6e323D7215EA5349A7B83CA3c4B415993fEF960';
  const CONTRACT_URI = '';
  const TOKEN_URI_PREFIX = '';
  // const CONTRACT_URI = 'https://api-mainnet.rarible.com/contractMetadata/{address}';
  // const TOKEN_URI_PREFIX = 'ipfs:/';

  await deployer.deploy(
    MintableToken,
    NAME,
    SYMBOL,
    SIGNER_ADDRESS,
    CONTRACT_URI,
    TOKEN_URI_PREFIX
  );

  await deployer.deploy(
    RaribleToken,
    NAME,
    SYMBOL,
    SIGNER_ADDRESS,
    CONTRACT_URI,
    TOKEN_URI_PREFIX
  );

  await deployer.deploy(WETH);
  await deployer.deploy(TransferProxy);
  await deployer.deploy(TransferProxyForDeprecated);
  await deployer.deploy(ERC20TransferProxy);
  await deployer.deploy(ExchangeStateV1);
  await deployer.deploy(ExchangeOrdersHolderV1);

  const [
    mintableTokenInst,
    raribleTokenInst,
    wethInst,
    transferProxyInst,
    transferProxyForDeprecatedInst,
    erc20TransferProxyInst,
    exchangeStateV1Inst,
    exchangeOrdersHolderV1Inst,
  ] = await Promise.all([
    MintableToken.deployed(),
    RaribleToken.deployed(),
    WETH.deployed(),
    TransferProxy.deployed(),
    TransferProxyForDeprecated.deployed(),
    ERC20TransferProxy.deployed(),
    ExchangeStateV1.deployed(),
    ExchangeOrdersHolderV1.deployed(),
  ]);

  await deployer.deploy(
    ExchangeV1,
    transferProxyInst.address,
    transferProxyForDeprecatedInst.address,
    erc20TransferProxyInst.address,
    exchangeStateV1Inst.address,
    exchangeOrdersHolderV1Inst.address,
    BENEFICIARY_ADDRESS,
    BUYER_FEE_SIGNER_ADDRESS
  );

  const exchangeV1Inst = await ExchangeV1.deployed();

  await transferProxyInst.addOperator(exchangeV1Inst.address);
  await transferProxyForDeprecatedInst.addOperator(exchangeV1Inst.address);
  await erc20TransferProxyInst.addOperator(exchangeV1Inst.address);
  await exchangeStateV1Inst.addOperator(exchangeV1Inst.address);

  console.log(`MintableToken: ${mintableTokenInst.address}`);
  console.log(`RaribleToken: ${raribleTokenInst.address}`);
  console.log(`WETH: ${wethInst.address}`);
  console.log(`TransferProxy: ${transferProxyInst.address}`);
  console.log(`TransferProxyForDeprecated: ${transferProxyForDeprecatedInst.address}`);
  console.log(`ERC20TransferProxy: ${erc20TransferProxyInst.address}`);
  console.log(`ExchangeStateV1: ${exchangeStateV1Inst.address}`);
  console.log(`ExchangeOrdersHolderV1: ${exchangeOrdersHolderV1Inst.address}`);
  console.log(`ExchangeV1: ${exchangeV1Inst.address}`);
};
