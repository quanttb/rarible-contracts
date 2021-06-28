const util = require('ethereumjs-util');
const fs = require('fs');
const path = require('path');

const accountsFromFile = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', 'accounts.json'), 'utf8')
);

const MintableToken = artifacts.require('MintableToken');

contract('MintableToken', function (accounts) {
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

  let mintableToken;

  const NAME = '721';
  const SYMBOL = '721';
  const CONTRACT_URI = '';
  const TOKEN_URI_PREFIX = '';

  const TOKEN_ID = 1;
  const ROYALTY = 1000;
  const URI = 'test';

  before('setup', async function () {
    mintableToken = await MintableToken.new(
      NAME,
      SYMBOL,
      signer,
      CONTRACT_URI,
      TOKEN_URI_PREFIX,
      { from: owner }
    );
  });

  it('mint', async () => {
    const hash = web3.utils.soliditySha3(mintableToken.address, TOKEN_ID);
    const privateKey = Buffer.from(signerPrivateKey, 'hex');
    const signature = util.ecsign(util.toBuffer(hash), privateKey);
    const v = signature.v;
    const r = util.bufferToHex(signature.r);
    const s = util.bufferToHex(signature.s);

    await mintableToken.mint(
      TOKEN_ID,
      v,
      r,
      s,
      [{ recipient: seller, value: ROYALTY }],
      URI,
      {
        from: seller,
      }
    );
  });

  it('safeTransferFrom', async () => {
    await mintableToken.safeTransferFrom(seller, buyer, TOKEN_ID, {
      from: seller,
    });
  });

  it('burn', async () => {
    await mintableToken.burn(TOKEN_ID, {
      from: buyer,
    });
  });
});
