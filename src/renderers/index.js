import renderPretty from './renderPretty';
import renderPlain from './renderPlain';
import renderJson from './renderJson';

const renderers = {
  pretty: renderPretty,
  plain: renderPlain,
  json: renderJson,
};

export default (diff, format) => renderers[format](diff);
