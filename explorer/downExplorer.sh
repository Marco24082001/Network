#!/bin/bash
# 
# Author: marco
# Script to down explorer

export EXPLORER_CONFIG_FILE_PATH=./config.json
export EXPLORER_PROFILE_DIR_PATH=./connection-profile
export FABRIC_CRYPTO_PATH=./organizations

docker-compose down -v

pushd ../apiserver
./networkDown.sh
popd
