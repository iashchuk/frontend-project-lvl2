import { renderDiff as renderPretty } from '../src/renderers/renderPretty';
import { renderDiff as renderPlain } from '../src/renderers/renderPlain';

describe('should be generate error for render unknown type', () => {
  const errorElement = {
    type: 'unchged',
    key: 'host',
    values: ['hexlet.io', 'hexlet.io'],
  };

  test('render pretty', () => {
    expect(() => renderPretty(errorElement)).toThrow(`Unknown type: ${errorElement.type}`);
  });

  test('render plain', () => {
    expect(() => renderPlain(errorElement)).toThrow(`Unknown type: ${errorElement.type}`);
  });
});
