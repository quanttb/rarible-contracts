# Rarible ExchangeV2 Contracts

## The following prerequisites are required to be installed on your system:

- NodeJS 12
- Yarn (optional)

Then run:

```sh
yarn install
chmod +x *.sh
./scripts/1-install.sh
./scripts/2-compile.sh
./scripts/3-flatten.sh
```

## Useful links

[Ropsten Faucet](https://faucet.dimensions.network/)

[Ropsten Explorer](https://ropsten.etherscan.io/)

[BSC Testnet Faucet](https://testnet.binance.org/faucet-smart)

[BSC Testnet Explorer](https://testnet.bscscan.com/)

[ABI Encoding Service](https://abi.hashex.org/)

## Deployed contracts

### Ropsten

    TBA

### Rinkeby

    - WETH: 0x401124E45C5e9A5B6122448522293BB0Ed0801c2
    - ERC721Rarible: 0xd5c2c0a2E97B0551b43b844ABafD11EC7FB5515b
    - ERC1155Rarible: 0x91bF113205A2D23c0014578b6DF4DC2Ea01aB3eF
    - ERC20TransferProxy: 0xE2FA71255957985E77412e449D97ACb8c230d3D1
    - TransferProxy: 0x0b5c87934b01Cc796CB3EEF93FD6e2b51f4fDAcA
    - ERC721LazyMintTransferProxy: 0xc7320b30Dc17Feb37435A049E356bf68493B6610
    - ERC1155LazyMintTransferProxy: 0x7399351922F24D1cb754a23196CC0be217D58114
    - RoyaltiesRegistry: 0xEb24f26322f618EaF5ceB8500BaBFDE776F839b6
    - ExchangeV2: 0x8D54aE35dF09db271d7f5FDc5C01b3e8C501a1Db

### BSC Testnet

    - WETH: 0xeBC9700183bE86f82d12AEbd5608bF98fe7F76d8
    - ERC721Rarible: 0xb8c24D0fb250A305684e78bbc18Cce13eaa13B1b
    - ERC1155Rarible: 0xDcC86c0493B45A295754ee7a0B7e80b781Cf0cF7
    - ERC20TransferProxy: 0x6CDD6b9d9e9a2bDb6C1D4B5FAC4d432B87C55b7f
    - TransferProxy: 0xBf3A8DA878218F10e0f0E59A272245Ee2008b3E2
    - ERC721LazyMintTransferProxy: 0x81422DDB32D508221e836B64f89433f2098B2123
    - ERC1155LazyMintTransferProxy: 0xe359eaa4a68c5505af0DdF1e49D6315c1734302C
    - RoyaltiesRegistry: 0xfE33C2b7Ae56DfcDBF1473A4437e96293D82D09c
    - ExchangeV2: 0x1a3B80b09Eb33c3F0aFf2B0917fd777503818E26

## Execution

### Test

```sh
yarn run test:dev
```

## Contribution

Your contribution is welcome and greatly appreciated. Please contribute your fixes and new features via a pull request.
Pull requests and proposed changes will then go through a code review and once approved will be merged into the project.

If you like my work, please leave me a star :)
