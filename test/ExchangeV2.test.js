const { Order, Asset, sign } = require('./order');
const { ETH, ERC20, ERC721, ERC1155, enc, id } = require('./assets');

const ERC1155Rarible = artifacts.require('ERC1155Rarible');
const WETH = artifacts.require('WETH');
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');
const TransferProxy = artifacts.require('TransferProxy');
const RoyaltiesRegistry = artifacts.require('RoyaltiesRegistry');
const ExchangeV2 = artifacts.require('ExchangeV2');

contract('ExchangeV2', function (accounts) {
  let [owner, seller, buyer, proxy, feeReceiver] = accounts;

  let erc1155Rarible,
    weth,
    transferProxy,
    erc20TransferProxy,
    royaltiesRegistry,
    exchangeV2;

  const NAME = 'NFTTIFY';
  const SYMBOL = 'NFTTIFY';
  const BASE_URI = '';
  const CONTRACT_URI = '';
  const PROTOCOL_FEE = 250;

  const ONE_ETHER = '1000000000000000000';
  const ZERO_WORD =
    '0x0000000000000000000000000000000000000000000000000000000000000000';

  beforeEach('setup', async function () {
    erc1155Rarible = await ERC1155Rarible.new({ from: owner });
    weth = await WETH.new({ from: owner });
    transferProxy = await TransferProxy.new({ from: owner });
    erc20TransferProxy = await ERC20TransferProxy.new({ from: owner });
    royaltiesRegistry = await RoyaltiesRegistry.new({ from: owner });
    exchangeV2 = await ExchangeV2.new({ from: owner });

    await erc1155Rarible.__ERC1155Rarible_init(
      NAME,
      SYMBOL,
      BASE_URI,
      CONTRACT_URI,
      { from: owner }
    );

    await transferProxy.__TransferProxy_init({ from: owner });
    await erc20TransferProxy.__ERC20TransferProxy_init({ from: owner });
    await royaltiesRegistry.__RoyaltiesRegistry_init({ from: owner });

    await transferProxy.addOperator(exchangeV2.address);
    await erc20TransferProxy.addOperator(exchangeV2.address);

    await exchangeV2.__ExchangeV2_init(
      transferProxy.address,
      erc20TransferProxy.address,
      PROTOCOL_FEE,
      feeReceiver,
      royaltiesRegistry.address
    );
  });

  it('matchOrders', async () => {
    await weth.transfer(seller, ONE_ETHER, { from: owner });
    await weth.approve(erc20TransferProxy.address, ONE_ETHER, { from: seller });

    const left = Order(
      seller,
      Asset(ERC20, enc(weth.address), 100),
      ZERO_WORD,
      Asset(ETH, '0x', 100),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );
    const right = Order(
      buyer,
      Asset(ETH, '0x', 100),
      ZERO_WORD,
      Asset(ERC20, enc(weth.address), 100),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );

    exchangeV2.matchOrders(
      left,
      await getSignature(left, seller),
      right,
      '0x',
      { from: buyer, value: 100 }
    );
  });

  async function getSignature(order, signer) {
    return sign(order, signer, exchangeV2.address);
  }
});
