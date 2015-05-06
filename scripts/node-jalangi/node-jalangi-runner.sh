#!/usr/bin/env bash
# Copyright (c) 2015 Samsung Electronics Co., Ltd.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#        http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# set -e
# set -x
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

usage_cli() {
    echo "Usage: $0 target-dir command..."
    echo "   Ex: $0 underscore npm run test-node"
}
missing_env() {
    echo -e "Missing environment variable: $1" 
}

if [  $# -le 2 ] 
then 
    usage_cli
    exit 1
fi

NJ_REAL_NODE=`which node`
if [ -z ${NJ_REAL_NODE+x} ]; then
    missing_env NJ_REAL_NODE
    exit 1
fi
if [ -z ${NJ_JALANGI+x} ]; then
    missing_env NJ_JALANGI
    exit 1 
fi
if [ -z ${NJ_JALANGI_ARGUMENTS+x} ]; then
    missing_env NJ_JALANGI_ARGUMENTS
    exit 1
fi

TARGET=$1
shift

# make a backup
TARGET_BAK=${TARGET}.bak
cp -r ${TARGET} ${TARGET_BAK}

pushd ${TARGET}

# change the node binary for npm based runs
NODE_MODULES=node_modules
NODE_MODULES_BIN=${NODE_MODULES}/.bin
NODE=${NODE_MODULES_BIN}/node

mkdir -p ${NODE_MODULES_BIN}
ln -s ${DIR}/node-jalangi.sh ${NODE}

# run with changed node on path
env PATH=${NODE}:${PATH} NJ_REAL_NODE=${NJ_REAL_NODE} $*

popd

# restore backup
rm -rf ${TARGET}
mv ${TARGET_BAK} ${TARGET}
