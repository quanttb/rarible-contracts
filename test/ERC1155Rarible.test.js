const { sign } = require('./mint');

const ERC1155Rarible = artifacts.require('ERC1155Rarible');

contract('ERC1155Rarible', function (accounts) {
  let [owner, seller, buyer, proxy] = accounts;

  let erc1155Rarible;

  const NAME = 'NFTTIFY';
  const SYMBOL = 'NFTTIFY';
  const BASE_URI = '';
  const CONTRACT_URI = '';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeEach('setup', async function () {
    erc1155Rarible = await ERC1155Rarible.new({ from: owner });

    await erc1155Rarible.__ERC1155Rarible_init(
      NAME,
      SYMBOL,
      BASE_URI,
      CONTRACT_URI,
      { from: owner }
    );
  });

  it('mintAndTransfer to self by minter', async () => {
    const tokenId = seller + 'b00000000000000000000001';
    const uri = '';
    const totalSupply = 10;
    const amount = 1;

    await erc1155Rarible.mintAndTransfer(
      [tokenId, uri, totalSupply, creators([seller]), [], [ZERO_ADDRESS]],
      buyer,
      amount,
      { from: seller }
    );
  });

  it('transferFromOrMint by minter', async () => {
    const tokenId = seller + 'b00000000000000000000001';
    const uri = '';
    const totalSupply = 10;
    const amount = 1;

    await erc1155Rarible.transferFromOrMint(
      [tokenId, uri, totalSupply, creators([seller]), [], [ZERO_ADDRESS]],
      seller,
      buyer,
      amount,
      { from: seller }
    );
  });

  it('mintAndTransfer by proxy', async () => {
    const tokenId = seller + 'b00000000000000000000001';
    const uri = '';
    const totalSupply = 10;
    const amount = 1;

    const signature = await getSignature(
      tokenId,
      uri,
      totalSupply,
      creators([seller]),
      [],
      seller
    );

    await erc1155Rarible.setDefaultApproval(proxy, true, { from: owner });
    await erc1155Rarible.mintAndTransfer(
      [tokenId, uri, totalSupply, creators([seller]), [], [signature]],
      buyer,
      amount,
      { from: proxy }
    );
  });

  function getSignature(tokenId, tokenURI, supply, creators, fees, account) {
    return sign(
      account,
      tokenId,
      tokenURI,
      supply,
      creators,
      fees,
      erc1155Rarible.address
    );
  }

  function creators(list) {
    const value = 10000 / list.length;
    return list.map((account) => ({ account, value }));
  }
});
