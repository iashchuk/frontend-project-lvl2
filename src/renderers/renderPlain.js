// @ts-check
import { isString, isObject } from 'lodash';

const renderPrimitive = (item) => (isString(item) ? `'${item}'` : item);

const formatValues = (values) => values.map((value) => (isObject(value) ? '[complex value]' : renderPrimitive(value)));


export const renderDiff = (diff, initPath = '') => {
  const iter = (element) => {
    const path = [initPath, element.key].filter(Boolean).join('.');

    if (element.type === 'nested') {
      return renderDiff(element.children, path);
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

  return diff.map(iter).filter(Boolean).join('\n');
};

const renderPlain = (diff) => renderDiff(diff);

export default renderPlain;
