import { styleText } from 'node:util'

export function blueBright(text: string) {
  return styleText("blueBright", text);
}

export function redBright(text: string) {
  return styleText("redBright", text);
}

export function yellow(text: string) {
  return styleText("yellow", text);
}
