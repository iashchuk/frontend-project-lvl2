export default class JsonParser {
  constructor(data) {
    this.data = data;
  }

  parse() {
    return JSON.parse(this.data);
  }
}
