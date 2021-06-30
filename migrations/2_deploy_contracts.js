const ERC721Rarible = artifacts.require('ERC721Rarible');
const ERC1155Rarible = artifacts.require('ERC1155Rarible');
const WETH = artifacts.require('WETH');
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');
const TransferProxy = artifacts.require('TransferProxy');
const RoyaltiesRegistry = artifacts.require('RoyaltiesRegistry');
const ExchangeV2 = artifacts.require('ExchangeV2');

module.exports = async function (deployer, network) {
  if (network === 'test') return;

  const NAME = 'NFTTIFY';
  const SYMBOL = 'NFTTIFY';
  const BASE_URI = '';
  const CONTRACT_URI = '';
  const PROTOCOL_FEE = 2500;
  const DEFAULT_FEE_RECEIVER = '0x9c3D7e0B53024147ef7966247d6BB61E60aCb200';

  await deployer.deploy(ERC721Rarible);
  await deployer.deploy(ERC1155Rarible);
  await deployer.deploy(WETH);
  await deployer.deploy(ERC20TransferProxy);
  await deployer.deploy(TransferProxy);
  await deployer.deploy(RoyaltiesRegistry);
  await deployer.deploy(ExchangeV2);

  const [
    erc721RaribleInst,
    erc1155RaribleInst,
    wethInst,
    erc20TransferProxyInst,
    transferProxyInst,
    royaltiesRegistryInst,
    exchangeV2Inst,
  ] = await Promise.all([
    ERC721Rarible.deployed(),
    ERC1155Rarible.deployed(),
    WETH.deployed(),
    ERC20TransferProxy.deployed(),
    TransferProxy.deployed(),
    RoyaltiesRegistry.deployed(),
    ExchangeV2.deployed(),
  ]);

  await erc721RaribleInst.__ERC721Rarible_init(
    NAME,
    SYMBOL,
    BASE_URI,
    CONTRACT_URI,
  );

  await erc1155RaribleInst.__ERC1155Rarible_init(
    NAME,
    SYMBOL,
    BASE_URI,
    CONTRACT_URI,
  );

  await erc20TransferProxyInst.__ERC20TransferProxy_init();
  await transferProxyInst.__TransferProxy_init();
  await royaltiesRegistryInst.__RoyaltiesRegistry_init();

  await erc20TransferProxyInst.addOperator(exchangeV2Inst.address);
  await transferProxyInst.addOperator(exchangeV2Inst.address);

  await exchangeV2Inst.__ExchangeV2_init(
    transferProxyInst.address,
    erc20TransferProxyInst.address,
    PROTOCOL_FEE,
    DEFAULT_FEE_RECEIVER,
    royaltiesRegistryInst.address,
  );

  console.log(`ERC721Rarible: ${erc721RaribleInst.address}`);
  console.log(`ERC1155Rarible: ${erc1155RaribleInst.address}`);
  console.log(`WETH: ${wethInst.address}`);
  console.log(`ERC20TransferProxy: ${erc20TransferProxyInst.address}`);
  console.log(`TransferProxy: ${transferProxyInst.address}`);
  console.log(`RoyaltiesRegistry: ${royaltiesRegistryInst.address}`);
  console.log(`ExchangeV2: ${exchangeV2Inst.address}`);
};
