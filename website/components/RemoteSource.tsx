import { compileMdx } from "nextra/compile";
import { MDXRemote } from "nextra/mdx-remote";
import { VariadicSingleton } from "tstl";

const BRACKET = "```";
const loader = new VariadicSingleton(async (url: string) => fetch(url).then(async r => r.text()));

interface RemoteSourceProps {
  url: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlight?: string;
}

export async function RemoteSource({
  url,
  filename,
  showLineNumbers,
  highlight,
}: RemoteSourceProps) {
  const content: string = await loader.get(url);
  const header: string = [
    `${BRACKET}typescript`,
    (filename ?? "").length > 0
      ? ` filename=${JSON.stringify(filename)}`
      : "",
    showLineNumbers ?? false ? " showLineNumbers" : "",
    (highlight ?? "").length > 0 ? ` {${highlight}}` : "",
  ].join("");
  const raw = await compileMdx([header, content.trim(), BRACKET].join("\n"));
  return <MDXRemote compiledSource={raw} />;
}

export default RemoteSource;
