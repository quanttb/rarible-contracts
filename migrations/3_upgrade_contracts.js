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

  const proxyContractAddress = [
    erc721RaribleInst.address,
    erc1155RaribleInst.address,
    erc20TransferProxyInst.address,
    transferProxyInst.address,
    erc721LazyMintTransferProxyInst.address,
    erc1155LazyMintTransferProxyInst.address,
    royaltiesRegistryInst.address,
    exchangeV2Inst.address,
  ];
  const implContractAddresses = await Promise.all(
    proxyContractAddress.map(async (addr) => {
      const implAddr = await web3.eth.getStorageAt(
        addr,
        '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
      );

      return `0x${implAddr.substr(implAddr.length - 40)}`;
    })
  );
  console.log('Implementation Contract Addresses:');
  console.log(implContractAddresses);
  fs.writeFileSync('contract-addresses.txt', 'WETH', {
    flag: 'w+',
  });
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nERC721Rarible@${implContractAddresses[0]}`,
    {
      flag: 'a',
    }
  );
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nERC1155Rarible@${implContractAddresses[1]}`,
    {
      flag: 'a',
    }
  );
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nERC20TransferProxy@${implContractAddresses[2]}`,
    {
      flag: 'a',
    }
  );
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nTransferProxy@${implContractAddresses[3]}`,
    {
      flag: 'a',
    }
  );
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nERC721LazyMintTransferProxy@${implContractAddresses[4]}`,
    {
      flag: 'a',
    }
  );
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nERC1155LazyMintTransferProxy@${implContractAddresses[5]}`,
    {
      flag: 'a',
    }
  );
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nRoyaltiesRegistry@${implContractAddresses[6]}`,
    {
      flag: 'a',
    }
  );
  fs.writeFileSync(
    'contract-addresses.txt',
    `\r\nExchangeV2@${implContractAddresses[7]}`,
    {
      flag: 'a',
    }
  );
};
