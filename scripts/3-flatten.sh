#!/bin/bash

# Exit on first error
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
PROTOCOL_DIR=${SCRIPT_DIR}/../protocol-contracts
OUTPUT_DIR=${SCRIPT_DIR}/../contracts

mkdir -p ${OUTPUT_DIR}

cd ${PROTOCOL_DIR}/tokens
truffle-flattener ${PROTOCOL_DIR}/tokens/contracts/erc-1155/ERC1155Rarible.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/ERC1155Rarible.sol
truffle-flattener ${PROTOCOL_DIR}/tokens/contracts/erc-721/ERC721Rarible.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/ERC721Rarible.sol

cd ${PROTOCOL_DIR}/transfer-proxy
truffle-flattener ${PROTOCOL_DIR}/transfer-proxy/contracts/lazy-mint/erc721/ERC721LazyMintTransferProxy.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/ERC721LazyMintTransferProxy.sol
truffle-flattener ${PROTOCOL_DIR}/transfer-proxy/contracts/lazy-mint/erc1155/ERC1155LazyMintTransferProxy.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/ERC1155LazyMintTransferProxy.sol
truffle-flattener ${PROTOCOL_DIR}/transfer-proxy/contracts/proxy/TransferProxy.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/TransferProxy.sol
truffle-flattener ${PROTOCOL_DIR}/transfer-proxy/contracts/proxy/ERC20TransferProxy.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/ERC20TransferProxy.sol

cd ${PROTOCOL_DIR}/royalties-registry
truffle-flattener ${PROTOCOL_DIR}/royalties-registry/contracts/RoyaltiesRegistry.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/RoyaltiesRegistry.sol

cd ${PROTOCOL_DIR}/exchange-v2
truffle-flattener ${PROTOCOL_DIR}/exchange-v2/contracts/ExchangeV2.sol |
  awk '/SPDX-License-Identifier/&&c++>0 {next} 1' |
  awk '/pragma abicoder/&&c++>0 {next} 1' >${OUTPUT_DIR}/ExchangeV2.sol

cd ${SCRIPT_DIR}/..
