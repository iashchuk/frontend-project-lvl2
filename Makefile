install:
	npm install

run:
	npx babel-node 'src/bin/gendiff.js' --format $(format) __tests__/__fixtures__/before.${ext} __tests__/__fixtures__/after.${ext}

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage