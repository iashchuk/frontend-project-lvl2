install:
	npm install

run-json:
	npx babel-node 'src/bin/gendiff.js' __tests__/__fixtures__/before.json __tests__/__fixtures__/after.json

run-yml:
	npx babel-node 'src/bin/gendiff.js' __tests__/__fixtures__/before.yml __tests__/__fixtures__/after.yml

run-yaml:
	npx babel-node 'src/bin/gendiff.js' __tests__/__fixtures__/before.yaml __tests__/__fixtures__/after.yaml

run-ini:
	npx babel-node 'src/bin/gendiff.js' __tests__/__fixtures__/before.ini __tests__/__fixtures__/after.ini

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage