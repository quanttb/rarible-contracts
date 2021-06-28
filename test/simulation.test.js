const util = require('ethereumjs-util');

const MintableToken = artifacts.require('MintableToken');

contract('MintableToken', function (accounts) {
  const signerPrivateKey = '8c7cab6c9ef311af22bbce86e48d3d62ca34cbc0403c737667fe8570877ae201';
  const mintableTokenAddress = '0x7399351922F24D1cb754a23196CC0be217D58114';

  const TOKEN_ID = 1;
  const ROYALTY = 1000;
  const URI = 'test';

  it('mint 721', async () => {
    const hash = web3.utils.soliditySha3(mintableTokenAddress, TOKEN_ID);
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
});
