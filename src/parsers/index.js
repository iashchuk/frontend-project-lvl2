import path from 'path';
import fs from 'fs';
import JsonParser from './JsonParser';
import YamlParser from './YamlParser';
import IniParser from './IniParser';

const parsers = {
  yaml: YamlParser,
  yml: YamlParser,
  json: JsonParser,
  ini: IniParser,
};

export default class ParseFactory {
  static factory(filePath) {
    const type = path.extname(filePath).slice(1);
    const rawData = fs.readFileSync(filePath).toString();

    const parser = new parsers[type](rawData);
    const data = parser.parse();

    return data;
  }
}
