import ini from 'ini';

export default class IniParser {
  constructor(data) {
    this.data = data;
  }

  parse() {
    return ini.parse(this.data);
  }
}
