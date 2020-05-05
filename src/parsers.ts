
import yaml from 'js-yaml';
import ini from 'ini';

type Parsers={[key:string]: typeof yaml.safeLoad | typeof JSON.parse |  typeof ini.parse}

const parsers: Parsers = {
  yaml: yaml.safeLoad,
  yml: yaml.safeLoad,
  json: JSON.parse,
  ini: ini.parse,
};

export default (type: string, rawData: string) => parsers[type](rawData);
