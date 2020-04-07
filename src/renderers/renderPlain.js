// @ts-check
import { isString, isObject } from 'lodash';


const renderPrimitive = (item) => (isString(item) ? `'${item}'` : item);


const renderDiff = (element, initPath = '') => {
  const [rawFirst, rawSecond] = element.values;
  const firstValue = isObject(rawFirst) ? '[complex value]' : renderPrimitive(rawFirst);
  const secondValue = isObject(rawSecond) ? '[complex value]' : renderPrimitive(rawSecond);
  const path = [initPath, element.key].filter(isString).join('.');

  switch (element.type) {
    case 'nested':
      return element.values.map((item) => renderDiff(item, path)).filter(Boolean).join('\n');

    case 'removed':
      return `Property '${path}' was removed`;

    case 'added':
      return `Property '${path}' was added with value: ${secondValue}`;

    case 'changed':
      return `Property '${path}' was updated. From ${firstValue} to ${secondValue}`;

    case 'unchanged':
      return '';

    default:
      throw new Error(`Unknown type: ${element.type}`);
  }
};

export default (diff) => diff.map(renderDiff).filter(Boolean).join('\n');
