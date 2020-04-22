// @ts-check

import _ from 'lodash';

const space = ' ';
const tabLength = 4;

const prefixes = {
  removed: '-',
  added: '+',
  unchanged: ' ',
};


const stringify = (element, spaceCount) => {
  if (!_.isObject(element)) {
    return element;
  }
  const render = ([key, value]) => `{\n${space.repeat(spaceCount + tabLength)}${key}: ${value}\n${space.repeat(spaceCount)}}`;
  return Object.entries(element).map(render);
};


export const renderDiff = (diff, depth = 0) => {
  const spaceCount = tabLength + depth * tabLength;

  const iter = ({
    firstValue, secondValue, type, key, children,
  }) => {
    const value1 = stringify(firstValue, spaceCount);
    const value2 = stringify(secondValue, spaceCount);

    const renderLine = (prefix, value) => {
      const sign = `${prefix}${space}`;
      return `${space.repeat(spaceCount - sign.length)}${sign}${key}: ${value}`;
    };
    const renderNestedLine = (value) => `${space.repeat(spaceCount)}${key}: {\n${value}\n${space.repeat(spaceCount)}}`;

    switch (type) {
      case 'nested':
        return renderNestedLine(renderDiff(children, depth + 1));

      case 'removed':
        return renderLine(prefixes.removed, value1);

      case 'added':
        return renderLine(prefixes.added, value2);

      case 'changed':
        return `${renderLine(prefixes.removed, value1)}\n${renderLine(prefixes.added, value2)}`;

      case 'unchanged':
        return renderLine(prefixes.unchanged, value1);

      default:
        throw new Error(`Unknown type: ${type}`);
    }
  };

  return diff.map(iter).join('\n');
};

const renderPretty = (diff) => `{\n${renderDiff(diff)}\n}`;

export default renderPretty;
