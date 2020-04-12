// @ts-check
import { isString, isObject } from 'lodash';


const renderPrimitive = (item) => (isString(item) ? `'${item}'` : item);

const formatValues = (values) => values.map((value) => (isObject(value) ? '[complex value]' : renderPrimitive(value)));


export const renderDiff = (element, initPath = '') => {
  const path = [initPath, element.key].filter(isString).join('.');

  if (element.type === 'nested') {
    return element.children.map((item) => renderDiff(item, path)).filter(Boolean).join('\n');
  }

  const [firstValue, secondValue] = formatValues(element.values);

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
