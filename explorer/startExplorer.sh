#!/bin/bash
# 
# Author: marco
# Script to start explorer

export EXPLORER_CONFIG_FILE_PATH=./config.json
export EXPLORER_PROFILE_DIR_PATH=./connection-profile
export FABRIC_CRYPTO_PATH=./organizations

# pushd ../apiserver
# ./startFabric.sh
# popd

cp -r ../test-network/organizations/ .

docker-compose up -d

cat <<EOF
