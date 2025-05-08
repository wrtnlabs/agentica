import fs from "node:fs";

import type { PathLike } from "node:fs";

export async function mkdir(str: string) {
  try {
    await fs.promises.mkdir(str, {
      recursive: true,
    });
  }
  catch {}
}
export async function rmdir(str: string) {
  try {
    await fs.promises.rm(str, {
      recursive: true,
    });
  }
  catch {}
}

export async function writeFile(path: PathLike, data: string) {
  await fs.promises.writeFile(path, data, "utf8");
}
