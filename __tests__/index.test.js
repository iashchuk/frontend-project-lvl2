import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const formats = ['json', 'yaml', 'yml', 'ini'];
const renderers = {
  pretty: 'pretty',
  plain: 'plain',
  json: 'json',
};

const getFixturePath = (name) => path.resolve(__dirname, '__fixtures__', name);

const getFilePaths = (format) => {
  const pathToFile1 = getFixturePath(`before.${format}`);
  const pathToFile2 = getFixturePath(`after.${format}`);
  return { pathToFile1, pathToFile2 };
};


describe('should be work correct with pretty renderer', () => {
  let expected;

  beforeAll(() => {
    expected = fs.readFileSync(getFixturePath('result.pretty.txt'), 'utf-8');
  });

  test.each(formats)('format: %s', (format) => {
    const { pathToFile1, pathToFile2 } = getFilePaths(format);
    const actual = genDiff(pathToFile1, pathToFile2, renderers.pretty);
    expect(actual).toEqual(expected.trim());
  });
});


describe('should be work correct with plain renderer', () => {
  let expected;

  beforeAll(() => {
    expected = fs.readFileSync(getFixturePath('result.plain.txt'), 'utf-8');
  });

  test.each(formats)('format: %s', (format) => {
    const { pathToFile1, pathToFile2 } = getFilePaths(format);
    const actual = genDiff(pathToFile1, pathToFile2, renderers.plain);
    expect(actual).toEqual(expected);
  });
});

describe('should be work correct with json renderer', () => {
  let expected;

  beforeAll(() => {
    expected = fs.readFileSync(getFixturePath('result.json.txt'), 'utf-8');
  });

  test.each(formats)('format: %s', (format) => {
    const { pathToFile1, pathToFile2 } = getFilePaths(format);
    const actual = genDiff(pathToFile1, pathToFile2, renderers.json);
    expect(actual).toEqual(expected);
  });
});
