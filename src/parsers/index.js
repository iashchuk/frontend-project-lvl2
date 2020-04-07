import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  yaml: yaml.safeLoad,
  yml: yaml.safeLoad,
  json: JSON.parse,
  ini: ini.parse,
};

export default (filePath) => {
  const type = path.extname(filePath).slice(1);
  const rawData = fs.readFileSync(filePath).toString();
  return parsers[type](rawData);
};
