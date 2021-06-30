const util = require('ethereumjs-util');

const MintableToken = artifacts.require('MintableToken');
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

contract('1155', function (accounts) {
  const signerPrivateKey = '8c7cab6c9ef311af22bbce86e48d3d62ca34cbc0403c737667fe8570877ae201';
  const sellerAddress = '0x9c3D7e0B53024147ef7966247d6BB61E60aCb200';
  const sellerPrivateKey = 'aa783f5af85fd98123872869f10640ec2010b99ad80180fd361610b46ea51b1b';
  const buyerAddress = '0x806eb7E72c37b2c6da49B9c0A0A424656c3CCdb5';
  // const mintableTokenAddress = '0x7399351922F24D1cb754a23196CC0be217D58114';
  const raribleTokenAddress = '0xED718fA3B78209014D3eff95484e2EB96b749eCD';
  const wethAddress = '0x8D54aE35dF09db271d7f5FDc5C01b3e8C501a1Db';
  const exchangeAddress = '0x203877De5BB3bf7be01736C9AD7eBd35bB4A3b9F';

  const TOKEN_ID = 2;
  const SUPPLY = 10;
  const ROYALTY = 1000;
  const URI = 'test';
  const SALT = 123;
  const BUYER_FEE = 0;

  const ONE_ETHER = '1000000000000000000';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  it('mint 1155', async () => {
    const hash = web3.utils.soliditySha3(raribleTokenAddress, TOKEN_ID);
    const privateKey = Buffer.from(signerPrivateKey, 'hex');
    const signature = util.ecsign(util.toBuffer(hash), privateKey);
    const v = signature.v;
    const r = util.bufferToHex(signature.r);
    const s = util.bufferToHex(signature.s);

    console.log(`tokenId: ${TOKEN_ID}`);
    console.log(`v: ${v}`);
    console.log(`r: ${r}`);
    console.log(`s: ${s}`);
  });

  it('exchange weth for 1155', async () => {
    const sellOrder = {
      key: {
        owner: sellerAddress,
        salt: SALT,
        sellAsset: {
          token: raribleTokenAddress,
          tokenId: TOKEN_ID,
          assetType: 2,
        },
        buyAsset: {
          token: wethAddress,
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
          'uint256'
        ],
        [sellOrder, BUYER_FEE]
      )
    );

    const buyerFeeSignature = web3.eth.accounts.sign(buyerFeeHash.slice(2), signerPrivateKey);

    console.log(`tokenId: ${TOKEN_ID}`);
    console.log('sellOrder');
    console.log(sellOrder);
    console.log(`v: ${web3.utils.hexToNumber(signature.v)}`);
    console.log(`r: ${signature.r}`);
    console.log(`s: ${signature.s}`);
    console.log(`buyerFee: ${BUYER_FEE}`);
    console.log(`v: ${web3.utils.hexToNumber(buyerFeeSignature.v)}`);
    console.log(`r: ${buyerFeeSignature.r}`);
    console.log(`s: ${buyerFeeSignature.s}`);
    console.log(`amount: 1`);
    console.log(`buyer: ${buyerAddress}`);
  });

  it('exchange eth for 1155', async () => {
    const sellOrder = {
      key: {
        owner: sellerAddress,
        salt: SALT,
        sellAsset: {
          token: raribleTokenAddress,
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
          'uint256'
        ],
        [sellOrder, BUYER_FEE]
      )
    );

    const buyerFeeSignature = web3.eth.accounts.sign(buyerFeeHash.slice(2), signerPrivateKey);

    console.log(`tokenId: ${TOKEN_ID}`);
    console.log(`payable: ${ONE_ETHER}`);
    console.log('sellOrder');
    console.log(sellOrder);
    console.log(`v: ${web3.utils.hexToNumber(signature.v)}`);
    console.log(`r: ${signature.r}`);
    console.log(`s: ${signature.s}`);
    console.log(`buyerFee: ${BUYER_FEE}`);
    console.log(`v: ${web3.utils.hexToNumber(buyerFeeSignature.v)}`);
    console.log(`r: ${buyerFeeSignature.r}`);
    console.log(`s: ${buyerFeeSignature.s}`);
    console.log(`amount: 1`);
    console.log(`buyer: ${buyerAddress}`);
  });
});
