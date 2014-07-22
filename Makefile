.PHONY: test

SHELL := /bin/bash

testchrome: 
	@./node_modules/karma/bin/karma start test/karma.conf.js --browsers Chrome --singleRun false

test: 
	@./node_modules/karma/bin/karma start test/karma.conf.js

refreshtestdata:
	bash ./scripts/refreshtestdata.sh

dist: refreshtestdata test
	mkdir -p ./dist
	./node_modules/.bin/browserify -t debowerify -e src/clamo.js -o dist/clamo.js -s Clamo 
	./node_modules/.bin/uglifyjs -o dist/clamo.min.js dist/clamo.js



