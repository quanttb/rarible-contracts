const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const ERC721Rarible = artifacts.require('ERC721Rarible');
const ERC1155Rarible = artifacts.require('ERC1155Rarible');
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');
const TransferProxy = artifacts.require('TransferProxy');
const ERC721LazyMintTransferProxy = artifacts.require(
  'ERC721LazyMintTransferProxy'
);
const ERC1155LazyMintTransferProxy = artifacts.require(
  'ERC1155LazyMintTransferProxy'
);
const RoyaltiesRegistry = artifacts.require('RoyaltiesRegistry');
const ExchangeV2 = artifacts.require('ExchangeV2');

module.exports = async function (deployer, network) {
  if (network === 'test') return;

  let [
    erc721RaribleInst,
    erc1155RaribleInst,
    erc20TransferProxyInst,
    transferProxyInst,
    erc721LazyMintTransferProxyInst,
    erc1155LazyMintTransferProxyInst,
    royaltiesRegistryInst,
    exchangeV2Inst,
  ] = await Promise.all([
    ERC721Rarible.deployed(),
    ERC1155Rarible.deployed(),
    ERC20TransferProxy.deployed(),
    TransferProxy.deployed(),
    ERC721LazyMintTransferProxy.deployed(),
    ERC1155LazyMintTransferProxy.deployed(),
    RoyaltiesRegistry.deployed(),
    ExchangeV2.deployed(),
  ]);

  erc721RaribleInst = await upgradeProxy(
    erc721RaribleInst.address,
    ERC721Rarible,
    { deployer }
  );
  erc1155RaribleInst = await upgradeProxy(
    erc1155RaribleInst.address,
    ERC1155Rarible,
    { deployer }
  );
  erc20TransferProxyInst = await upgradeProxy(
    erc20TransferProxyInst.address,
    ERC20TransferProxy,
    { deployer }
  );
  transferProxyInst = await upgradeProxy(
    transferProxyInst.address,
    TransferProxy,
    { deployer }
  );
  erc721LazyMintTransferProxyInst = await upgradeProxy(
    erc721LazyMintTransferProxyInst.address,
    ERC721LazyMintTransferProxy,
    { deployer }
  );
  erc1155LazyMintTransferProxyInst = await upgradeProxy(
    erc1155LazyMintTransferProxyInst.address,
    ERC1155LazyMintTransferProxy,
    { deployer }
  );
  royaltiesRegistryInst = await upgradeProxy(
    royaltiesRegistryInst.address,
    RoyaltiesRegistry,
    { deployer }
  );
  exchangeV2Inst = await upgradeProxy(exchangeV2Inst.address, ExchangeV2, {
    deployer,
  });

  console.log('Contract Addresses:');
  console.log(`- ERC721Rarible: ${erc721RaribleInst.address}`);
  console.log(`- ERC1155Rarible: ${erc1155RaribleInst.address}`);
  console.log(`- ERC20TransferProxy: ${erc20TransferProxyInst.address}`);
  console.log(`- TransferProxy: ${transferProxyInst.address}`);
  console.log(
    `- ERC721LazyMintTransferProxy: ${erc721LazyMintTransferProxyInst.address}`
  );
  console.log(
    `- ERC1155LazyMintTransferProxy: ${erc1155LazyMintTransferProxyInst.address}`
  );
  console.log(`- RoyaltiesRegistry: ${royaltiesRegistryInst.address}`);
  console.log(`- ExchangeV2: ${exchangeV2Inst.address}`);
};
