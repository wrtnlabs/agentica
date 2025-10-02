import { addMissingBraces, removeEmptyObjectPrefix, removeTrailingCommas } from "es-jsonkit";

export const JsonUtil = {
  parse,
};

function parse(str: string) {
  const corrected = pipe(removeEmptyObjectPrefix, addMissingBraces, removeTrailingCommas)(str);
  return JSON.parse(corrected);
}

const pipe = (...fns: ((str: string) => string)[]) => (str: string) => fns.reduce((acc, fn) => fn(acc), str);

