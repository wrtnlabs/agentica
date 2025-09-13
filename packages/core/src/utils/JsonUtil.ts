function parse(str: string) {
  if (str.startsWith("{}{") === true) {
    str = str.substring(2);
  }
  return JSON.parse(str);
}

export const JsonUtil = {
  parse,
};
