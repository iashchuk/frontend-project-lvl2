install:
	npm install

run:
	ts-node 'src/bin/gendiff.ts' --format $(format) __tests__/__fixtures__/before.${ext} __tests__/__fixtures__/after.${ext}

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage