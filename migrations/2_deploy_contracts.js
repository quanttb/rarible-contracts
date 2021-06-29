const ExchangeV2 = artifacts.require('ExchangeV2');
const ERC721Rarible = artifacts.require('ERC721Rarible');

module.exports = async function (deployer, network) {
  if (network === 'test') return;

  // await deployer.deploy(ERC721Rarible);

  await deployer.deploy(ExchangeV2);
  // const address = '0x9c3D7e0B53024147ef7966247d6BB61E60aCb200';
  // const exchangeV2Inst = await ExchangeV2.deployed(
  //   address,
  //   address,
  //   0,
  //   address,
  //   address,
  // );

  // const erc721RaribleInst = await ERC721Rarible.deployed();
  // const exchangeV2Inst = await ExchangeV2.deployed();
  // console.log(`ERC721Rarible: ${erc721RaribleInst.address}`);
  // console.log(`ExchangeV2: ${exchangeV2Inst.address}`);
};
