const { Order, Asset, sign } = require('./order');
const { sign: lazyMintedSign } = require('./mint');
const { ETH, ERC20, ERC1155, id, enc, lazyMintedEnc } = require('./assets');
const BigNumber = require('bignumber.js');

const ERC1155Rarible = artifacts.require('ERC1155Rarible');
const WETH = artifacts.require('WETH');
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');
const TransferProxy = artifacts.require('TransferProxy');
const ERC1155LazyMintTransferProxy = artifacts.require(
  'ERC1155LazyMintTransferProxy'
);
const RoyaltiesRegistry = artifacts.require('RoyaltiesRegistry');
const ExchangeV2 = artifacts.require('ExchangeV2');

contract('ExchangeV2', function (accounts) {
  let [owner, seller, buyer, feeReceiver] = accounts;

  let erc1155Rarible,
    weth,
    transferProxy,
    erc1155LazyMintTransferProxy,
    erc20TransferProxy,
    royaltiesRegistry,
    exchangeV2;

  const NAME = 'NFTTIFY';
  const SYMBOL = 'NFTTIFY';
  const BASE_URI = '';
  const CONTRACT_URI = '';
  const PROTOCOL_FEE = 250;

  const ERC721_LAZY = id('ERC721_LAZY');
  const ONE_ETHER = BigNumber('1000000000000000000');
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach('setup', async function () {
    erc1155Rarible = await ERC1155Rarible.new({ from: owner });
    weth = await WETH.new({ from: owner });
    transferProxy = await TransferProxy.new({ from: owner });
    erc1155LazyMintTransferProxy = await ERC1155LazyMintTransferProxy.new({
      from: owner,
    });
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
    await erc1155LazyMintTransferProxy.__OperatorRole_init({ from: owner });
    await royaltiesRegistry.__RoyaltiesRegistry_init({ from: owner });

    await transferProxy.addOperator(exchangeV2.address, { from: owner });
    await erc20TransferProxy.addOperator(exchangeV2.address, { from: owner });
    await erc1155LazyMintTransferProxy.addOperator(exchangeV2.address, {
      from: owner,
    });

    await exchangeV2.__ExchangeV2_init(
      transferProxy.address,
      erc20TransferProxy.address,
      PROTOCOL_FEE,
      feeReceiver,
      royaltiesRegistry.address,
      { from: owner }
    );

    await exchangeV2.setTransferProxy(
      ERC721_LAZY,
      erc1155LazyMintTransferProxy.address,
      { from: owner }
    );

    await erc1155Rarible.setDefaultApproval(
      erc1155LazyMintTransferProxy.address,
      true,
      { from: owner }
    );
  });

  it('ERC20 to ETH', async () => {
    await weth.mint(ONE_ETHER, { from: seller });
    await weth.approve(erc20TransferProxy.address, ONE_ETHER, { from: seller });

    const left = Order(
      seller,
      Asset(ERC20, enc(weth.address), ONE_ETHER.toFixed()),
      ZERO_ADDRESS,
      Asset(ETH, '0x', ONE_ETHER.toFixed()),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );
    const right = Order(
      buyer,
      Asset(ETH, '0x', ONE_ETHER.toFixed()),
      ZERO_ADDRESS,
      Asset(ERC20, enc(weth.address), ONE_ETHER.toFixed()),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );

    await exchangeV2.matchOrders(
      left,
      await getSignature(left, seller),
      right,
      '0x',
      {
        from: buyer,
        value: ONE_ETHER.times(10000 + PROTOCOL_FEE)
          .div(10000)
          .toFixed(),
      }
    );
  });

  it('ERC1155 to ETH', async () => {
    const tokenId = seller + 'b00000000000000000000001';
    const uri = '';
    const totalSupply = 10;
    const amount = 1;

    await erc1155Rarible.mintAndTransfer(
      [tokenId, uri, totalSupply, [[seller, 10000]], [], [ZERO_ADDRESS]],
      seller,
      amount,
      { from: seller }
    );

    await erc1155Rarible.setApprovalForAll(transferProxy.address, true, {
      from: seller,
    });

    const left = Order(
      seller,
      Asset(ERC1155, enc(erc1155Rarible.address, tokenId), amount),
      ZERO_ADDRESS,
      Asset(ETH, '0x', ONE_ETHER.toFixed()),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );
    const right = Order(
      buyer,
      Asset(ETH, '0x', ONE_ETHER.toFixed()),
      ZERO_ADDRESS,
      Asset(ERC1155, enc(erc1155Rarible.address, tokenId), amount),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );

    await exchangeV2.matchOrders(
      left,
      await getSignature(left, seller),
      right,
      '0x',
      {
        from: buyer,
        value: ONE_ETHER.times(10000 + PROTOCOL_FEE)
          .div(10000)
          .toFixed(),
      }
    );
  });

  it('Lazy Minted ERC1155 to ETH', async () => {
    const tokenId = seller + 'b00000000000000000000001';
    const uri = '';
    const totalSupply = 10;
    const amount = 1;

    const signature = await getLazyMintedSignature(
      tokenId,
      uri,
      totalSupply,
      [
        {
          account: seller,
          value: 10000,
        },
      ],
      [],
      seller
    );

    const left = Order(
      seller,
      Asset(
        ERC721_LAZY,
        lazyMintedEnc(erc1155Rarible.address, [
          tokenId,
          uri,
          totalSupply,
          [[seller, 10000]],
          [],
          [signature],
        ]),
        amount
      ),
      ZERO_ADDRESS,
      Asset(ETH, '0x', ONE_ETHER.toFixed()),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );
    const right = Order(
      buyer,
      Asset(ETH, '0x', ONE_ETHER.toFixed()),
      ZERO_ADDRESS,
      Asset(
        ERC721_LAZY,
        lazyMintedEnc(erc1155Rarible.address, [
          tokenId,
          uri,
          totalSupply,
          [[seller, 10000]],
          [],
          [signature],
        ]),
        amount
      ),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );

    await exchangeV2.matchOrders(
      left,
      await getSignature(left, seller),
      right,
      '0x',
      {
        from: buyer,
        value: ONE_ETHER.times(10000 + PROTOCOL_FEE)
          .div(10000)
          .toFixed(),
      }
    );
  });

  it('ETH to Lazy Minted ERC1155', async () => {
    const tokenId = seller + 'b00000000000000000000001';
    const uri = '';
    const totalSupply = 10;
    const amount = 1;

    const signature = await getLazyMintedSignature(
      tokenId,
      uri,
      totalSupply,
      [
        {
          account: seller,
          value: 10000,
        },
      ],
      [],
      seller
    );

    await weth.mint(ONE_ETHER.times(2), { from: buyer });
    await weth.approve(erc20TransferProxy.address, ONE_ETHER.times(2), {
      from: buyer,
    });

    const left = Order(
      buyer,
      Asset(ERC20, enc(weth.address), ONE_ETHER.toFixed()),
      seller,
      Asset(
        ERC721_LAZY,
        lazyMintedEnc(erc1155Rarible.address, [
          tokenId,
          uri,
          totalSupply,
          [[seller, 10000]],
          [],
          [signature],
        ]),
        amount
      ),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );
    const right = Order(
      seller,
      Asset(
        ERC721_LAZY,
        lazyMintedEnc(erc1155Rarible.address, [
          tokenId,
          uri,
          totalSupply,
          [[seller, 10000]],
          [],
          [signature],
        ]),
        amount
      ),
      ZERO_ADDRESS,
      Asset(ERC20, enc(weth.address), ONE_ETHER.toFixed()),
      1,
      0,
      0,
      '0xffffffff',
      '0x'
    );

    await exchangeV2.matchOrders(
      left,
      await getSignature(left, buyer),
      right,
      '0x',
      { from: seller }
    );
  });

  async function getSignature(order, signer) {
    return sign(order, signer, exchangeV2.address);
  }

  async function getLazyMintedSignature(
    tokenId,
    tokenURI,
    supply,
    creators,
    fees,
    account
  ) {
    return lazyMintedSign(
      account,
      tokenId,
      tokenURI,
      supply,
      creators,
      fees,
      erc1155Rarible.address
    );
  }
});
