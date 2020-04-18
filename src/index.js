// @ts-check
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parseFactory from './parsers';
import render from './renderers';


const getData = (config) => {
  const filepath = path.resolve(config);
  const type = path.extname(filepath).slice(1);
  const rawData = fs.readFileSync(filepath).toString();
  const data = parseFactory(type, rawData);
  return data;
};

const compareData = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2)).sort();

  const processDiff = (key) => {
    const firstValue = data1[key];
    const secondValue = data2[key];

    if (_.isObject(firstValue) && _.isObject(secondValue)) {
      return { type: 'nested', key, children: compareData(firstValue, secondValue) };
    }

    if (!_.has(data1, key) && _.has(data2, key)) {
      return { type: 'added', key, secondValue };
    }

    if (_.has(data1, key) && !_.has(data2, key)) {
      return { type: 'removed', key, firstValue };
    }

    if (firstValue !== secondValue) {
      return {
        type: 'changed', key, firstValue, secondValue,
      };
    }
    return { type: 'unchanged', key, firstValue };
  };

  return keys.map(processDiff);
};


const genDiff = (pathToFile1, pathToFile2, format) => {
  const data1 = getData(pathToFile1);
  const data2 = getData(pathToFile2);
  const diff = compareData(data1, data2);
  return render(diff, format);
};

export default genDiff;
