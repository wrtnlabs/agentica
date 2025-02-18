import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

export class TestGlobal {
  public static readonly ROOT: string =
    __filename.substring(__filename.length - 2) === "js"
      ? `${__dirname}/../..`
      : `${__dirname}/..`;

  public static get env(): IEnvironments {
    return environments.get();
  }

  public static getArguments(type: string): string[] {
    const from: number = process.argv.indexOf(`--${type}`) + 1;
    if (from === 0) return [];
    const to: number = process.argv
      .slice(from)
      .findIndex((str) => str.startsWith("--"), from);
    return process.argv.slice(
      from,
      to === -1 ? process.argv.length : to + from,
    );
  }
}

interface IEnvironments {
  CHATGPT_API_KEY?: string;
  CHATGPT_BASE_URL?: string;
  CHATGPT_OPTIONS?: string;
}

const environments = new Singleton(() => {
  console.log(
    "before, has CHATGPT_API_KEY",
    process.env.CHATGPT_API_KEY === ""
      ? "empty string"
      : !!process.env.CHATGPT_API_KEY,
  );
  const env = dotenv.config();
  dotenvExpand.expand(env);
  console.log(
    "after, has CHATGPT_API_KEY",
    process.env.CHATGPT_API_KEY === ""
      ? "empty string"
      : !!process.env.CHATGPT_API_KEY,
  );
  return typia.assert<IEnvironments>(process.env);
});
