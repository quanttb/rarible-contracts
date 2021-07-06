const ethUtil = require('ethereumjs-util');

function id(str) {
  return `0x${ethUtil.keccak256(str).toString('hex').substring(0, 8)}`;
}

function enc(token, tokenId) {
  if (tokenId) {
    return web3.eth.abi.encodeParameters(
      ['address', 'uint256'],
      [token, tokenId]
    );
  } else {
    return web3.eth.abi.encodeParameter('address', token);
  }
}

function lazyMintedEnc(token, data) {
  return web3.eth.abi.encodeParameters(
    [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'supply',
            type: 'uint256',
          },
          {
            components: [
              {
                internalType: 'address payable',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint96',
                name: 'value',
                type: 'uint96',
              },
            ],
            internalType: 'struct LibPart.Part[]',
            name: 'creators',
            type: 'tuple[]',
          },
          {
            components: [
              {
                internalType: 'address payable',
                name: 'account',
                type: 'address',
              },
              {
                internalType: 'uint96',
                name: 'value',
                type: 'uint96',
              },
            ],
            internalType: 'struct LibPart.Part[]',
            name: 'royalties',
            type: 'tuple[]',
          },
          {
            internalType: 'bytes[]',
            name: 'signatures',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct LibERC1155LazyMint.Mint1155Data',
        name: 'data',
        type: 'tuple',
      },
    ],
    [token, data]
  );
}

const ETH = id('ETH');
const ERC20 = id('ERC20');
const ERC721 = id('ERC721');
const ERC1155 = id('ERC1155');
const ORDER_DATA_V1 = id('V1');
const TO_MAKER = id('TO_MAKER');
const TO_TAKER = id('TO_TAKER');
const PROTOCOL = id('PROTOCOL');
const ROYALTY = id('ROYALTY');
const ORIGIN = id('ORIGIN');
const PAYOUT = id('PAYOUT');

module.exports = {
  id,
  ETH,
  ERC20,
  ERC721,
  ERC1155,
  ORDER_DATA_V1,
  TO_MAKER,
  TO_TAKER,
  PROTOCOL,
  ROYALTY,
  ORIGIN,
  PAYOUT,
  enc,
  lazyMintedEnc,
};
