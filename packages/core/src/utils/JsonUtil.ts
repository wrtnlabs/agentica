// import { addMissingBraces, removeEmptyObjectPrefix, removeTrailingCommas } from "es-jsonkit";
import { jsonrepair } from "jsonrepair";

export const JsonUtil = {
  parse<T>(str: string): T {
    return JSON.parse(jsonrepair(str));
  },
};

// const pipe = (...fns: ((str: string) => string)[]) => (str: string) => fns.reduce((acc, fn) => fn(acc), str);
// function parse(str: string) {
//   const corrected = pipe(removeEmptyObjectPrefix, addMissingBraces, removeTrailingCommas)(str);
//   return JSON.parse(corrected);
// }
