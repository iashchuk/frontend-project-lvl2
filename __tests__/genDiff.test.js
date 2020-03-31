import fs from 'fs';
import path from 'path';
import genDiff from '../src/genDiff';

const formats = ['json'];
const getFixturePath = (name) => path.resolve(__dirname, '__fixtures__', name);

let expected;

beforeAll(() => {
  expected = fs.readFileSync(getFixturePath('result.txt'), 'utf-8');
});

test.each(formats)('%s', (format) => {
  const pathToFile1 = getFixturePath(`before.${format}`);
  const pathToFile2 = getFixturePath(`after.${format}`);
  const actual = genDiff(pathToFile1, pathToFile2);
  expect(actual).toEqual(expected.trim());
});
