
all:
	mkdir -p ./target

build: all 
	./node_modules/.bin/browserify -e src/clamo.js -o target/clamo.js -s Clamo 

karma: all 
	./node_modules/.bin/browserify test/fastft-api-client.spec.js -o target/clamo.spec.js -s Clamo
	./node_modules/karma/bin/karma start karma.conf.js --log-level debug --debug

dist: build
	cp target/clamo.js dist/clamo.js
	./node_modules/.bin/uglifyjs -o dist/clamo.min.js dist/clamo.js

