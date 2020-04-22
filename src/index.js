// @ts-check
import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import parse from './parsers';
import render from './renderers';


const getData = (pathToFile) => {
  const filepath = path.resolve(pathToFile);
  const type = path.extname(filepath).slice(1);
  const rawData = fs.readFileSync(filepath).toString();
  const data = parse(type, rawData);
  return data;
};

const compareData = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2)).sort();

  const processDiff = (key) => {
    const firstValue = data1[key];
    const secondValue = data2[key];


    if (!_.has(data1, key)) {
      return { type: 'added', key, secondValue };
    }

    if (!_.has(data2, key)) {
      return { type: 'removed', key, firstValue };
    }

    if (firstValue === secondValue) {
      return {
        type: 'unchanged', key, firstValue,
      };
    }

    if (_.isObject(firstValue) && _.isObject(secondValue)) {
      return { type: 'nested', key, children: compareData(firstValue, secondValue) };
    }

    return {
      type: 'changed', key, firstValue, secondValue,
    };
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
