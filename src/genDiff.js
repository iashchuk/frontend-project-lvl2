// @ts-check

import _ from 'lodash';
import path from 'path';
import ParseFactory from './parsers';


const space = ' ';

const getData = (config) => {
  const filepath = path.resolve(config);
  const data = ParseFactory.factory(filepath);
  return data;
};

const compareData = (data1, data2) => {
  const keys = _.union(_.keys(data1), _.keys(data2)).sort();

  const processDiff = (key) => {
    const firstValue = data1[key];
    const secondValue = data2[key];

    const info = { key, values: [firstValue, secondValue] };

    if (_.isObject(firstValue) && _.isObject(secondValue)) {
      return { type: 'nested', key, values: compareData(firstValue, secondValue) };
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      return { type: 'added', ...info };
    }

    if (_.has(data1, key) && !_.has(data2, key)) {
      return { type: 'removed', ...info };
    }

    if (firstValue !== secondValue) {
      return { type: 'changed', ...info };
    }
    return { type: 'unchanged', ...info };
  };

  return keys.map(processDiff);
};


const renderObject = (item, spaceCount) => {
  const render = ([key, value]) => `{\n${space.repeat(spaceCount + 6)}${key}: ${value}\n${space.repeat(spaceCount + 2)}}`;
  return _.toPairs(item).map(render);
};

export const renderDiff = (element, spaceCount) => {
  if (element.type === 'nested') {
    const renderNestedLine = (value) => `${space.repeat(spaceCount + 2)}${element.key}: {\n${value}\n${space.repeat(spaceCount + 2)}}`;
    return renderNestedLine(
      element.values.map((item) => renderDiff(item, spaceCount + 4)).join('\n'),
    );
  }

  const [rawFirst, rawSecond] = element.values;
  const firstValue = _.isObject(rawFirst) ? renderObject(rawFirst, spaceCount) : rawFirst;
  const secondValue = _.isObject(rawSecond) ? renderObject(rawSecond, spaceCount) : rawSecond;
  const renderLine = (prefix, value) => `${space.repeat(spaceCount)}${prefix}${space}${element.key}: ${value}`;


  switch (element.type) {
    case 'removed':
      return renderLine('-', firstValue);

    case 'added':
      return renderLine('+', secondValue);

    case 'changed':
      return `${renderLine('-', firstValue)}\n${renderLine('+', secondValue)}`;

    case 'unchanged':
      return renderLine(' ', firstValue);

    default:
      throw new Error(`Unknown type: ${element.type}`);
  }
};

const genDiff = (pathToFile1, pathToFile2) => {
  const before = getData(pathToFile1);
  const after = getData(pathToFile2);
  const diff = compareData(before, after);
  return `{\n${diff.map((item) => renderDiff(item, 2)).join('\n')}\n}`;
};

export default genDiff;
