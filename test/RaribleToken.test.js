const util = require('ethereumjs-util');

const RaribleToken = artifacts.require('RaribleToken');

contract('RaribleToken', function (accounts) {
  let owner = accounts[0];
  let user1 = accounts[1];
  let user2 = accounts[2];
  let raribleToken;

  const NAME = 'a';
  const SYMBOL = 'a';
  const SIGNER_ADDRESS = '0x2e6d9aD80a79caB9940429026a52CD2a88A7f32c';
  const CONTRACT_URI = 'a';
  const TOKEN_URI_PREFIX = 'a';
  const SIGNER_PRIVATE_KEY =
    '82c681db6efcd2a8d6925f7eb6b33dbbc4d4982e40167fc4fefa7f47b6bf5abb';

  const TOKEN_ID = 1;
  const ROYALTY = 1000;
  const SUPPLY = 10;
  const URI = 'test';

  before('setup', async function () {
    raribleToken = await RaribleToken.new(
      NAME,
      SYMBOL,
      SIGNER_ADDRESS,
      CONTRACT_URI,
      TOKEN_URI_PREFIX,
      { from: owner }
    );
  });

  it('mint', async () => {
    const hash = web3.utils.soliditySha3(raribleToken.address, TOKEN_ID);
    const privateKey = Buffer.from(SIGNER_PRIVATE_KEY, 'hex');
    const signature = util.ecsign(util.toBuffer(hash), privateKey);
    const r = util.bufferToHex(signature.r);
    const s = util.bufferToHex(signature.s);
    const v = signature.v;

    await raribleToken.mint(
      TOKEN_ID,
      v,
      r,
      s,
      [{ recipient: user1, value: ROYALTY }],
      SUPPLY,
      URI,
      {
        from: user1,
      }
    );
  });

  it('safeTransferFrom', async () => {
    await raribleToken.safeTransferFrom(user1, user2, TOKEN_ID, 5, 0, {
      from: user1,
    });
  });

  it('burn', async () => {
    await raribleToken.burn(user1, TOKEN_ID, 1, {
      from: user1,
    });
  });
});
