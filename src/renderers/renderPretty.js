// @ts-check

import _ from 'lodash';

const space = ' ';

const prefixes = {
  removed: '-',
  added: '+',
  unchanged: ' ',
};

const renderObject = (item, spaceCount) => {
  const render = ([key, value]) => `{\n${space.repeat(spaceCount + 6)}${key}: ${value}\n${space.repeat(spaceCount + 2)}}`;
  return _.toPairs(item).map(render);
};

const formatValue = (value, spaceCount) => {
  if (_.isObject(value)) {
    return renderObject(value, spaceCount);
  }
  return value;
};


export const renderDiff = (diff, spaceCount) => {
  const iter = (element) => {
    const firstValue = formatValue(element.firstValue, spaceCount);
    const secondValue = formatValue(element.secondValue, spaceCount);

    const renderLine = (prefix, value) => `${space.repeat(spaceCount)}${prefix}${space}${element.key}: ${value}`;
    const renderNestedLine = (value) => `${space.repeat(spaceCount + 2)}${element.key}: {\n${value}\n${space.repeat(spaceCount + 2)}}`;


    switch (element.type) {
      case 'nested':
        return renderNestedLine(renderDiff(element.children, spaceCount + 4));

      case 'removed':
        return renderLine(prefixes.removed, firstValue);

      case 'added':
        return renderLine(prefixes.added, secondValue);

      case 'changed':
        return `${renderLine(prefixes.removed, firstValue)}\n${renderLine(prefixes.added, secondValue)}`;

      case 'unchanged':
        return renderLine(prefixes.unchanged, firstValue);

      default:
        throw new Error(`Unknown type: ${element.type}`);
    }
  };

  return diff.map(iter).join('\n');
};

const renderPretty = (diff) => `{\n${renderDiff(diff, 2)}\n}`;

export default renderPretty;
