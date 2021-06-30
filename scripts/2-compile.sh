#!/bin/bash

# Exit on first error
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)
PROTOCOL_DIR=${SCRIPT_DIR}/../protocol-contracts

cd ${PROTOCOL_DIR}/tokens
rm -rf ${PROTOCOL_DIR}/tokens/build
truffle compile

cd ${PROTOCOL_DIR}/transfer-proxy
rm -rf ${PROTOCOL_DIR}/transfer-proxy/build
truffle compile

cd ${PROTOCOL_DIR}/royalties-registry
rm -rf ${PROTOCOL_DIR}/royalties-registry/build
truffle compile

cd ${PROTOCOL_DIR}/exchange-v2
rm -rf ${PROTOCOL_DIR}/exchange-v2/build
truffle compile

cd ${SCRIPT_DIR}/..
