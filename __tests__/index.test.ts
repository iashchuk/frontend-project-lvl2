import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const formats: string[] = ['json', 'yaml', 'yml', 'ini'];

const getFixturePath = (name: string) => path.resolve(__dirname, '__fixtures__', name);

const getFilePaths = (format: string) => {
  const pathToFile1 = getFixturePath(`before.${format}`);
  const pathToFile2 = getFixturePath(`after.${format}`);
  return { pathToFile1, pathToFile2 };
};


const getResult = (format: string) => fs.readFileSync(getFixturePath(`result.${format}.txt`), 'utf-8');

describe('should be work correct', () => {
  let expectedPretty: string;
  let expectedPlain: string;
  let expectedJson: string;

  beforeAll(() => {
    expectedPretty = getResult('pretty');
    expectedPlain = getResult('plain');
    expectedJson = getResult('json');
  });

  test.each(formats)('format: %s', (format) => {
    const { pathToFile1, pathToFile2 } = getFilePaths(format);
    expect(genDiff(pathToFile1, pathToFile2, 'pretty')).toEqual(expectedPretty);
    expect(genDiff(pathToFile1, pathToFile2, 'plain')).toEqual(expectedPlain);
    expect(genDiff(pathToFile1, pathToFile2, 'json')).toEqual(expectedJson);
  });
});
