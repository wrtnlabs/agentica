import path from "node:path";
import process from "node:process";

import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Singleton } from "tstl";
import typia from "typia";

const environments = new Singleton(() => {
  const env = dotenv.config();
  dotenvExpand.expand(env);
  return typia.assert<IEnvironments>(process.env);
});

export class TestGlobal {
  public static readonly ROOT: string
    = __filename.substring(__filename.length - 2) === "js"
      ? path.join(__dirname, "..", "..")
      : path.join(__dirname, "..");

  public static get env(): IEnvironments {
    return environments.get();
  }

  public static getArguments(type: string): string[] {
    const from: number = process.argv.indexOf(`--${type}`) + 1;
    if (from === 0) {
      return [];
    }
    const to: number = process.argv
      .slice(from)
      .findIndex(str => str.startsWith("--"), from);
    return process.argv.slice(
      from,
      to === -1 ? process.argv.length : to + from,
    );
  }

  public static get connectorHivePort(): number {
    return 37001;
  }

  public static get chatgptApiKey(): string {
    return this.env.CHATGPT_API_KEY ?? "";
  }
}

interface IEnvironments {
  CHATGPT_API_KEY?: string;
  CHATGPT_BASE_URL?: string;
  CHATGPT_OPTIONS?: string;
  OPENROUTER_API_KEY?: string;
}
