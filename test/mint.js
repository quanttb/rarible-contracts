const { createTypeData, signTypedData } = require("./EIP712");

const Types = {
	Part: [
		{name: 'account', type: 'address'},
		{name: 'value', type: 'uint96'}
	],
	Mint1155: [
		{name: 'tokenId', type: 'uint256'},
		{name: 'supply', type: 'uint256'},
		{name: 'tokenURI', type: 'string'},
		{name: 'creators', type: 'Part[]'},
		{name: 'royalties', type: 'Part[]'}
	]
};

async function sign(account, tokenId, tokenURI, supply, creators, royalties, verifyingContract) {
	const chainId = Number(await web3.eth.getChainId());
  // // Workaround
  // creators = creators.map(c => ({
  //   account: c[0],
  //   value: c[1],
  // }));
  // royalties = royalties.map(r => ({
  //   account: r[0],
  //   value: r[1],
  // }));
  console.log('creators');
  console.log(creators);
  console.log('royalties');
  console.log(royalties);
	const data = createTypeData({
		name: "Mint1155",
		chainId,
		version: "1",
		verifyingContract
	}, 'Mint1155', { tokenId, supply, tokenURI, creators, royalties }, Types);
	console.log('data');
	console.log(data);
  return (await signTypedData(web3, account, data)).sig;
}

module.exports = { sign }