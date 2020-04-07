import renderPretty from './renderPretty';
import renderPlain from './renderPlain';

const renderers = {
  pretty: renderPretty,
  plain: renderPlain,
};

export default (diff, format) => renderers[format](diff);
