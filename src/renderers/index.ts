import renderPretty from './renderPretty';
import renderPlain from './renderPlain';
import renderJson from './renderJson';
import { DiffType } from '../index';

type Renderers={[key:string]: typeof renderPretty | typeof renderPlain |  typeof renderJson}

const renderers: Renderers = {
  pretty: renderPretty,
  plain: renderPlain,
  json: renderJson,
};

export default (diff: DiffType[], format: string) => renderers[format](diff);
