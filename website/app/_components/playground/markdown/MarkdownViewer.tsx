import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkMermaidPlugin from "remark-mermaid-plugin";

interface IProps {
  children: string | null | undefined;
}
export const MarkdownViewer = (props: IProps) => {
  return (
    <Markdown
      remarkPlugins={[remarkMermaidPlugin] as unknown as null}
      rehypePlugins={[rehypeRaw, rehypeStringify]}
      components={{
        img: ({ ...props }) => (
          <img
            {...props}
            style={{
              display: "block",
              maxWidth: "100%",
              height: "auto",
            }}
          />
        ),
      }}
    >
      {props.children}
    </Markdown>
  );
};
