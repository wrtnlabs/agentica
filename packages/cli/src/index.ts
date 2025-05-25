import process from "node:process";

import type { Args, Command } from "gunshi";

import * as p from "@clack/prompts";
import { cli, define } from "gunshi";
import * as picocolors from "picocolors";

import { description, name, version } from "../package.json";

import { start } from "./commands";
import { START_TEMPLATES, startCommand } from "./commands/start";

// Create a Map of sub-commands
const subCommands = new Map<string, Command<Args>>();
subCommands.set("start", startCommand);

const mainCommand = define({
  name,
});

async function program() {
  return cli(process.argv.slice(2), mainCommand, {
    subCommands,
    name,
    version,
    description,
  });
}

export async function run() {
  await program();
}
