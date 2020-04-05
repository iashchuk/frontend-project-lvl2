import renderPretty from './renderPretty';

const renderers = {
  pretty: renderPretty,
};

export default (diff, format) => renderers[format](diff);
