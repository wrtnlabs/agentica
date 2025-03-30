import { compileMdx } from "nextra/compile";
import { MDXRemote } from "nextra/mdx-remote";
import { VariadicSingleton } from "tstl";

export async function RemoteSource(props: {
  url: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlight?: string;
}) {
  const content: string = await loader.get(props.url);
  const header: string = [
    `${BRACKET}typescript`,
    props.filename?.length
      ? ` filename=${JSON.stringify(props.filename)}`
      : "",
    props.showLineNumbers ? " showLineNumbers" : "",
    props.highlight?.length ? ` {${props.highlight}}` : "",
  ].join("");
  const raw = await compileMdx([header, content.trim(), BRACKET].join("\n"));
  return <MDXRemote compiledSource={raw} />;
}
export default RemoteSource;

const BRACKET = "```";
const loader = new VariadicSingleton(async url => fetch(url).then(async r => r.text()));
