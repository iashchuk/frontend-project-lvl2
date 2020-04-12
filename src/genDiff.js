// @ts-check

import {
  union, keys as getKeys, isObject, has as hasKey,
} from 'lodash';
import path from 'path';
import parseFactory from './parsers';
import render from './renderers';


const getData = (config) => {
  const filepath = path.resolve(config);
  const data = parseFactory(filepath);
  return data;
};

const compareData = (data1, data2) => {
  const keys = union(getKeys(data1), getKeys(data2)).sort();

  const processDiff = (key) => {
    const firstValue = data1[key];
    const secondValue = data2[key];

    const info = { key, values: [firstValue, secondValue] };

    if (isObject(firstValue) && isObject(secondValue)) {
      return { type: 'nested', key, children: compareData(firstValue, secondValue) };
    }

    if (!hasKey(data1, key) && hasKey(data2, key)) {
      return { type: 'added', ...info };
    }

    if (hasKey(data1, key) && !hasKey(data2, key)) {
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
