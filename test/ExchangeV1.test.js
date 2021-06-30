const util = require('ethereumjs-util');
const fs = require('fs');
const path = require('path');

const accountsFromFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'accounts.json'), 'utf8')
);

const RaribleToken = artifacts.require('RaribleToken');
const TransferProxy = artifacts.require('TransferProxy');
const TransferProxyForDeprecated = artifacts.require(
  'TransferProxyForDeprecated'
);
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');
const ExchangeStateV1 = artifacts.require('ExchangeStateV1');
const ExchangeOrdersHolderV1 = artifacts.require('ExchangeOrdersHolderV1');
const ExchangeV1 = artifacts.require('ExchangeV1');
const WETH = artifacts.require('WETH');

contract('ExchangeV1', function (accounts) {
  const privateKeys = accounts.map((a) => {
    return accountsFromFile.private_keys[a.toLowerCase()];
  });

  let [
    owner,
    signer,
    beneficiary,
    buyerFeeSigner,
    seller,
    buyer
  ] = accounts;
  let [
    ownerPrivateKey,
    signerPrivateKey,
    beneficiaryPrivateKey,
    buyerFeeSignerPrivateKey,
    sellerPrivateKey,
    buyerPrivateKey
  ] = privateKeys;

  let raribleToken;
  let transferProxy;
  let transferProxyForDeprecated;
  let erc20TransferProxy;
  let exchangeStateV1;
  let exchangeOrdersHolderV1;
  let exchangeV1;
  let weth;

  const NAME = 'NFT';
  const SYMBOL = 'NFT';
  const CONTRACT_URI = '';
  const TOKEN_URI_PREFIX = '';

  const TOKEN_ID = 1;
  const ROYALTY = 1000;
  const SUPPLY = 10;
  const URI = 'test';
  const BUYER_FEE = 0;

  const ONE_ETHER = '1000000000000000000';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  before('setup', async function () {
    raribleToken = await RaribleToken.new(
      NAME,
      SYMBOL,
      signer,
      CONTRACT_URI,
      TOKEN_URI_PREFIX,
      { from: owner }
    );
    transferProxy = await TransferProxy.new({ from: owner });
    transferProxyForDeprecated = await TransferProxyForDeprecated.new({
      from: owner,
    });
    erc20TransferProxy = await ERC20TransferProxy.new({ from: owner });
    exchangeStateV1 = await ExchangeStateV1.new({ from: owner });
    exchangeOrdersHolderV1 = await ExchangeOrdersHolderV1.new({ from: owner });
    exchangeV1 = await ExchangeV1.new(
      transferProxy.address,
      transferProxyForDeprecated.address,
      erc20TransferProxy.address,
      exchangeStateV1.address,
      exchangeOrdersHolderV1.address,
      beneficiary,
      buyerFeeSigner,
      { from: owner }
    );
    weth = await WETH.new({ from: owner });

    await transferProxy.addOperator(exchangeV1.address, { from: owner });
    await transferProxyForDeprecated.addOperator(exchangeV1.address, { from: owner });
    await erc20TransferProxy.addOperator(exchangeV1.address, { from: owner });
    await exchangeStateV1.addOperator(exchangeV1.address, { from: owner });

    await weth.transfer(buyer, ONE_ETHER, { from: owner });
    await weth.approve(erc20TransferProxy.address, ONE_ETHER, { from: buyer });
  });

  it('mint 1155', async () => {
    const hash = web3.utils.soliditySha3(raribleToken.address, TOKEN_ID);
    const privateKey = Buffer.from(signerPrivateKey, 'hex');
    const signature = util.ecsign(util.toBuffer(hash), privateKey);
    const r = util.bufferToHex(signature.r);
    const s = util.bufferToHex(signature.s);
    const v = signature.v;

    await raribleToken.mint(
      TOKEN_ID,
      v,
      r,
      s,
      [{ recipient: seller, value: ROYALTY }],
      SUPPLY,
      URI,
      {
        from: seller,
      }
    );

    await raribleToken.setApprovalForAll(
      transferProxy.address,
      true,
      {
        from: seller,
      }
    );
  });

  it('exchange weth for 1155', async () => {
    const sellOrder = {
      key: {
        owner: seller,
        salt: 1,
        sellAsset: {
          token: raribleToken.address,
          tokenId: TOKEN_ID,
          assetType: 2,
        },
        buyAsset: {
          token: weth.address,
          tokenId: 0,
          assetType: 1,
        },
      },
      selling: 1,
      buying: ONE_ETHER,
      sellerFee: 2500,
    };

    const hash = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        [
          {
            Order: {
              key: {
                owner: 'address',
                salt: 'uint256',
                sellAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
                buyAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
              },
              selling: 'uint256',
              buying: 'uint256',
              sellerFee: 'uint256',
            },
          },
        ],
        [sellOrder]
      )
    );
    const signature = web3.eth.accounts.sign(hash.slice(2), sellerPrivateKey);

    const buyerFeeHash = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        [
          {
            Order: {
              key: {
                owner: 'address',
                salt: 'uint256',
                sellAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
                buyAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
              },
              selling: 'uint256',
              buying: 'uint256',
              sellerFee: 'uint256',
            },
          },
          "uint256"
        ],
        [sellOrder, BUYER_FEE]
      )
    );

    const buyerFeeSignature = web3.eth.accounts.sign(buyerFeeHash.slice(2), buyerFeeSignerPrivateKey);

    await exchangeV1.exchange(
      sellOrder,
      {
        v: signature.v,
        r: signature.r,
        s: signature.s,
      },
      BUYER_FEE,
      {
        v: buyerFeeSignature.v,
        r: buyerFeeSignature.r,
        s: buyerFeeSignature.s,
      },
      1,
      buyer,
      {
        from: buyer,
      }
    );
  });

  it('exchange eth for 1155', async () => {
    const sellOrder = {
      key: {
        owner: seller,
        salt: 1,
        sellAsset: {
          token: raribleToken.address,
          tokenId: TOKEN_ID,
          assetType: 2,
        },
        buyAsset: {
          token: ZERO_ADDRESS,
          tokenId: 0,
          assetType: 0,
        },
      },
      selling: 1,
      buying: ONE_ETHER,
      sellerFee: 2500,
    };

    const hash = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        [
          {
            Order: {
              key: {
                owner: 'address',
                salt: 'uint256',
                sellAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
                buyAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
              },
              selling: 'uint256',
              buying: 'uint256',
              sellerFee: 'uint256',
            },
          },
        ],
        [sellOrder]
      )
    );
    const signature = web3.eth.accounts.sign(hash.slice(2), sellerPrivateKey);

    const buyerFeeHash = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        [
          {
            Order: {
              key: {
                owner: 'address',
                salt: 'uint256',
                sellAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
                buyAsset: {
                  token: 'address',
                  tokenId: 'uint256',
                  assetType: 'uint',
                },
              },
              selling: 'uint256',
              buying: 'uint256',
              sellerFee: 'uint256',
            },
          },
          "uint256"
        ],
        [sellOrder, BUYER_FEE]
      )
    );

    const buyerFeeSignature = web3.eth.accounts.sign(buyerFeeHash.slice(2), buyerFeeSignerPrivateKey);

    await exchangeV1.exchange(
      sellOrder,
      {
        v: signature.v,
        r: signature.r,
        s: signature.s,
      },
      BUYER_FEE,
      {
        v: buyerFeeSignature.v,
        r: buyerFeeSignature.r,
        s: buyerFeeSignature.s,
      },
      1,
      buyer,
      {
        from: buyer,
        value: ONE_ETHER,
      }
    );
  });
});
