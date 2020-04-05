// @ts-check

import _ from 'lodash';
import path from 'path';
import ParseFactory from './parsers';
import render from './renderers';


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


const genDiff = (pathToFile1, pathToFile2, format) => {
  const before = getData(pathToFile1);
  const after = getData(pathToFile2);
  const diff = compareData(before, after);
  return render(diff, format);
};

export default genDiff;
