import { renderDiff } from '../src/genDiff';

describe('renderDiff', () => {
  it('test added element', () => {
    const addedElement = {
      type: 'added',
      key: 'verbose',
      values: [undefined, true],
    };

    expect(renderDiff(addedElement)).toBe(`+ ${addedElement.key}: ${addedElement.values[1]}`);
  });
  it('test removed element', () => {
    const removedElement = {
      type: 'removed',
      key: 'proxy',
      values: ['123.234.53.22', undefined],
    };
    expect(renderDiff(removedElement)).toBe(`- ${removedElement.key}: ${removedElement.values[0]}`);
  });
  it('test changed element', () => {
    const changedElement = {
      type: 'changed',
      key: 'timeout',
      values: [50, 20],
    };
    expect(renderDiff(changedElement)).toBe(
      `- ${changedElement.key}: ${changedElement.values[0]}\n+ ${changedElement.key}: ${changedElement.values[1]}`,
    );
  });
  it('test unchanged element', () => {
    const unchangedElement = {
      type: 'unchanged',
      key: 'host',
      values: ['hexlet.io', 'hexlet.io'],
    };
    expect(renderDiff(unchangedElement)).toBe(`  ${unchangedElement.key}: ${unchangedElement.values[0]}`);
  });
  it('test unknown element', () => {
    const errorElement = {
      type: 'unchged',
      key: 'host',
      values: ['hexlet.io', 'hexlet.io'],
    };
    expect(() => renderDiff(errorElement)).toThrow(`Unknown type: ${errorElement.type}`);
  });
});
