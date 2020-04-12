// @ts-check
import { isString, isObject } from 'lodash';


const renderPrimitive = (item) => (isString(item) ? `'${item}'` : item);


export const renderDiff = (element, initPath = '') => {
  const path = [initPath, element.key].filter(isString).join('.');

  if (element.type === 'nested') {
    return element.children.map((item) => renderDiff(item, path)).filter(Boolean).join('\n');
  }
  const [rawFirst, rawSecond] = element.values;
  const firstValue = isObject(rawFirst) ? '[complex value]' : renderPrimitive(rawFirst);
  const secondValue = isObject(rawSecond) ? '[complex value]' : renderPrimitive(rawSecond);


  switch (element.type) {
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
