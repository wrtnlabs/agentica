import { addMissingBraces, removeEmptyObjectPrefix, removeTrailingCommas } from "es-jsonkit";

export const JsonUtil = {
  parse,
};

const pipe = (...fns: ((str: string) => string)[]) => (str: string) => fns.reduce((acc, fn) => fn(acc), str);
function parse(str: string) {
  const corrected = pipe(removeEmptyObjectPrefix, addMissingBraces, removeTrailingCommas)(str);
  return JSON.parse(corrected);
}
