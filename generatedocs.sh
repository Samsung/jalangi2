#!/usr/bin/env bash

rm -rf jaguarjs-jsdoc/
npm install jsdoc
git clone https://github.com/davidshimjs/jaguarjs-jsdoc.git
cd jaguarjs-jsdoc/
npm install
cd ..
./node_modules/.bin/jsdoc --pedantic src/js/runtime/analysisCallbackTemplate.js src/js/runtime/SMemory.js -d docs -t ./jaguarjs-jsdoc/  -c conf.json
