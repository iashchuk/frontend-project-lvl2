// @ts-check
import _ from 'lodash';

const renderPrimitive = (item) => (_.isString(item) ? `'${item}'` : item);
const formatValue = (value) => (_.isObject(value) ? '[complex value]' : renderPrimitive(value));

export const renderDiff = (diff, initPath = '') => {
  const iter = (element) => {
    const path = initPath ? `${initPath}.${element.key}` : element.key;
    const firstValue = formatValue(element.firstValue);
    const secondValue = formatValue(element.secondValue);

    switch (element.type) {
      case 'nested':
        return renderDiff(element.children, path);

      case 'removed':
        return `Property '${path}' was removed`;

      case 'added':
        return `Property '${path}' was added with value: ${secondValue}`;

      case 'changed':
        return `Property '${path}' was updated. From ${firstValue} to ${secondValue}`;

      case 'unchanged':
        return null;

      default:
        throw new Error(`Unknown type: ${element.type}`);
    }
  };

  return diff.map(iter).filter(Boolean).join('\n');
};

const renderPlain = (diff) => renderDiff(diff);

export default renderPlain;
