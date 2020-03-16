// @ts-check

import _ from 'lodash';
import path from 'path';
import ParseFactory from './parsers';

const getData = (config) => {
  const filepath = path.resolve(config);
  const data = ParseFactory.factory(filepath);
  return data;
};

const compareData = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  const processDiff = (key) => {
    const firstValue = data1[key];
    const secondValue = data2[key];

    const info = { key, values: [firstValue, secondValue] };

    if (_.has(data1, key) && !_.has(data2, key)) {
      return { type: 'removed', ...info };
    }
    if (!_.has(data1, key) && _.has(data2, key)) {
      return { type: 'added', ...info };
    }
    if (firstValue !== secondValue) {
      return { type: 'changed', ...info };
    }
    return { type: 'unchanged', ...info };
  };

  return keys.map(processDiff);
};

export const renderDiff = (element) => {
  const [firstValue, secondValue] = element.values;

  switch (element.type) {
    case 'removed':
      return `- ${element.key}: ${firstValue}`;

    case 'added':
      return `+ ${element.key}: ${secondValue}`;

    case 'changed':
      return `- ${element.key}: ${firstValue}\n+ ${element.key}: ${secondValue}`;

    case 'unchanged':
      return `${element.key}: ${firstValue}`;

    default:
      throw new Error(`Unknown type: ${element.type}`);
  }
};

const genDiff = (pathToFile1, pathToFile2) => {
  const before = getData(pathToFile1);
  const after = getData(pathToFile2);
  const diff = compareData(before, after);
  return diff.map(renderDiff).join('\n');
};

export default genDiff;
