install:
	npm install

run:
	npx babel-node 'bin/gendiff.js' fixtures/before.json fixtures/after.json

lint:
	npx eslint .