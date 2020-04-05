// @ts-check

import _ from 'lodash';

const space = ' ';

const renderObject = (item, spaceCount) => {
  const render = ([key, value]) => `{\n${space.repeat(spaceCount + 6)}${key}: ${value}\n${space.repeat(spaceCount + 2)}}`;
  return _.toPairs(item).map(render);
};

export const renderDiff = (element, spaceCount) => {
  if (element.type === 'nested') {
    const renderNestedLine = (value) => `${space.repeat(spaceCount + 2)}${element.key}: {\n${value}\n${space.repeat(spaceCount + 2)}}`;
    return renderNestedLine(
      element.values.map((item) => renderDiff(item, spaceCount + 4)).join('\n'),
    );
  }

  const [rawFirst, rawSecond] = element.values;
  const firstValue = _.isObject(rawFirst) ? renderObject(rawFirst, spaceCount) : rawFirst;
  const secondValue = _.isObject(rawSecond) ? renderObject(rawSecond, spaceCount) : rawSecond;
  const renderLine = (prefix, value) => `${space.repeat(spaceCount)}${prefix}${space}${element.key}: ${value}`;


  switch (element.type) {
    case 'removed':
      return renderLine('-', firstValue);

    case 'added':
      return renderLine('+', secondValue);

    case 'changed':
      return `${renderLine('-', firstValue)}\n${renderLine('+', secondValue)}`;

    case 'unchanged':
      return renderLine(' ', firstValue);

    default:
      throw new Error(`Unknown type: ${element.type}`);
  }
};


const renderPretty = (diff) => `{\n${diff.map((item) => renderDiff(item, 2)).join('\n')}\n}`;

export default renderPretty;
