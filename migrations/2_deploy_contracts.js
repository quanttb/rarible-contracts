const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const WETH = artifacts.require('WETH');
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

  const NAME = 'NFTTIFY';
  const SYMBOL = 'NFTTIFY';
  const BASE_URI = '';
  const CONTRACT_URI = '';
  const PROTOCOL_FEE = 2500;
  const DEFAULT_FEE_RECEIVER = '0xfB83d7c56cc5bE4a1CFb686805b0816E5A886877';

  await deployer.deploy(WETH);

  const erc721RaribleInst = await deployProxy(
    ERC721Rarible,
    [NAME, SYMBOL, BASE_URI, CONTRACT_URI],
    { deployer, initializer: '__ERC721Rarible_init' }
  );
  const erc1155RaribleInst = await deployProxy(
    ERC1155Rarible,
    [NAME, SYMBOL, BASE_URI, CONTRACT_URI],
    { deployer, initializer: '__ERC1155Rarible_init' }
  );
  const erc20TransferProxyInst = await deployProxy(ERC20TransferProxy, [], {
    deployer,
    initializer: '__ERC20TransferProxy_init',
  });
  const transferProxyInst = await deployProxy(TransferProxy, [], {
    deployer,
    initializer: '__TransferProxy_init',
  });
  const erc721LazyMintTransferProxyInst = await deployProxy(
    ERC721LazyMintTransferProxy,
    [],
    {
      deployer,
      initializer: '__OperatorRole_init',
    }
  );
  const erc1155LazyMintTransferProxyInst = await deployProxy(
    ERC1155LazyMintTransferProxy,
    [],
    {
      deployer,
      initializer: '__OperatorRole_init',
    }
  );
  const royaltiesRegistryInst = await deployProxy(RoyaltiesRegistry, [], {
    deployer,
    initializer: '__RoyaltiesRegistry_init',
  });
  const exchangeV2Inst = await deployProxy(
    ExchangeV2,
    [
      transferProxyInst.address,
      erc20TransferProxyInst.address,
      PROTOCOL_FEE,
      DEFAULT_FEE_RECEIVER,
      royaltiesRegistryInst.address,
    ],
    {
      deployer,
      initializer: '__ExchangeV2_init',
    }
  );

  const [wethInst] = await Promise.all([WETH.deployed()]);

  await erc20TransferProxyInst.addOperator(exchangeV2Inst.address);
  await transferProxyInst.addOperator(exchangeV2Inst.address);
  await erc721LazyMintTransferProxyInst.addOperator(exchangeV2Inst.address);
  await erc1155LazyMintTransferProxyInst.addOperator(exchangeV2Inst.address);

  console.log('Contract Addresses:');
  console.log(`- WETH: ${wethInst.address}`);
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
