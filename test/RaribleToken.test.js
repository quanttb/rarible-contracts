const util = require('ethereumjs-util');
const fs = require('fs');
const path = require('path');

const accountsFromFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'accounts.json'), 'utf8')
);

const RaribleToken = artifacts.require('RaribleToken');

contract('RaribleToken', function (accounts) {
  const privateKeys = accounts.map((a) => {
    return accountsFromFile.private_keys[a.toLowerCase()];
  });

  let [
    owner,
    signer,
    seller,
    buyer,
  ] = accounts;
  let [
    ownerPrivateKey,
    signerPrivateKey,
    sellerPrivateKey,
    buyerPrivateKey
  ] = privateKeys;

  let raribleToken;

  const NAME = '1155';
  const SYMBOL = '1155';
  const CONTRACT_URI = '';
  const TOKEN_URI_PREFIX = '';

  const TOKEN_ID = 1;
  const ROYALTY = 1000;
  const SUPPLY = 10;
  const URI = 'test';

  before('setup', async function () {
    raribleToken = await RaribleToken.new(
      NAME,
      SYMBOL,
      signer,
      CONTRACT_URI,
      TOKEN_URI_PREFIX,
      { from: owner }
    );
  });

  it('mint', async () => {
    const hash = web3.utils.soliditySha3(raribleToken.address, TOKEN_ID);
    const privateKey = Buffer.from(signerPrivateKey, 'hex');
    const signature = util.ecsign(util.toBuffer(hash), privateKey);
    const v = signature.v;
    const r = util.bufferToHex(signature.r);
    const s = util.bufferToHex(signature.s);

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
  });

  it('safeTransferFrom', async () => {
    await raribleToken.safeTransferFrom(seller, buyer, TOKEN_ID, SUPPLY - 2, 0, {
      from: seller,
    });
  });

  it('burn', async () => {
    await raribleToken.burn(buyer, TOKEN_ID, 1, {
      from: buyer,
    });
  });
});
