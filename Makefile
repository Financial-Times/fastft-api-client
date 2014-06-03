
all:
	mkdir -p ./target

build: all 
	./node_modules/.bin/browserify -t debowerify -e src/clamo.js -o target/clamo.js -s Clamo 

testRebuild: all
	./node_modules/.bin/browserify -d -t debowerify test/browsertest.js -o target/clamo.spec.js -s Clamo

test: all 
	./node_modules/.bin/browserify -d -t debowerify test/browsertest.js -o target/clamo.spec.js -s Clamo
	./node_modules/karma/bin/karma start test/karma.conf.js

dist: test build
	cp target/clamo.js dist/clamo.js
	./node_modules/.bin/uglifyjs -o dist/clamo.min.js dist/clamo.js

refreshtestdata:
	bash ./scripts/refreshtestdata.sh

