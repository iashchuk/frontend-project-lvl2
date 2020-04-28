// @ts-check
import _ from 'lodash';


const formatValue = (value) => {
  if (_.isString(value)) {
    return `'${value}'`;
  }
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return value;
};

export const renderDiff = (diff, ancestors = []) => {
  const iter = ({
    key, type, firstValue, secondValue, children,
  }) => {
    const path = [...ancestors, key];
    const value1 = formatValue(firstValue);
    const value2 = formatValue(secondValue);

    switch (type) {
      case 'nested':
        return renderDiff(children, path);

      case 'removed':
        return `Property '${path.join('.')}' was removed`;

      case 'added':
        return `Property '${path.join('.')}' was added with value: ${value2}`;

      case 'changed':
        return `Property '${path.join('.')}' was updated. From ${value1} to ${value2}`;

      case 'unchanged':
        return null;

      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  return diff.map(iter).filter(Boolean).join('\n');
};

const renderPlain = (diff) => renderDiff(diff);

export default renderPlain;
