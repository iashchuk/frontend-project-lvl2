// @ts-check

import { isObject, toPairs } from 'lodash';

const space = ' ';

const prefixes = {
  removed: '-',
  added: '+',
  unchanged: ' ',
};

const renderObject = (item, spaceCount) => {
  const render = ([key, value]) => `{\n${space.repeat(spaceCount + 6)}${key}: ${value}\n${space.repeat(spaceCount + 2)}}`;
  return toPairs(item).map(render);
};

const formatValues = (values, spaceCount) => {
  const func = (value) => (isObject(value) ? renderObject(value, spaceCount) : value);
  return values.map(func);
};


export const renderDiff = (diff, spaceCount) => {
  const iter = (element) => {
    if (element.type === 'nested') {
      const renderNestedLine = (value) => `${space.repeat(spaceCount + 2)}${element.key}: {\n${value}\n${space.repeat(spaceCount + 2)}}`;
      return renderNestedLine(renderDiff(element.children, spaceCount + 4));
    }

    const [firstValue, secondValue] = formatValues(element.values, spaceCount);
    const renderLine = (prefix, value) => `${space.repeat(spaceCount)}${prefix}${space}${element.key}: ${value}`;


    switch (element.type) {
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
