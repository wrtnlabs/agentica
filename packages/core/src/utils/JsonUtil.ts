import { addMissingBraces, removeEmptyObjectPrefix, removeTrailingCommas } from "es-jsonkit";
import { jsonrepair } from "jsonrepair";

export const JsonUtil = {
  parse,
};

const pipe = (...fns: ((str: string) => string)[]) => (str: string) => fns.reduce((acc, fn) => fn(acc), str);
function parse(str: string) {
  const corrected: string = pipe(
    removeEmptyObjectPrefix,
    addMissingBraces,
    removeTrailingCommas,
    jsonrepair,
  )(str);
  return JSON.parse(corrected);
}
