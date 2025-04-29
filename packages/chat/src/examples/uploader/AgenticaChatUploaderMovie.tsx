import type { OpenApiV3, OpenApiV3_1, SwaggerV2 } from "@samchon/openapi";

import { OpenApi } from "@samchon/openapi";
import { load } from "js-yaml";
import React from "react";
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import FileUpload from "react-mui-fileuploader";
import typia from "typia";

interface ExtendedFileProps extends Blob {
  arrayBuffer: () => Promise<ArrayBuffer>;
  name: string;
  size: number;
  path: string;
  type: string;
  extension: string | undefined;
}

export function AgenticaChatUploaderMovie(props: AgenticaChatUploaderMovie.IProps) {
  const [elements, setElements] = React.useState<ExtendedFileProps[]>([]);
  const onChange = async (array: ExtendedFileProps[]) => {
    const lastFile: ExtendedFileProps | undefined = array.at(-1);
    if (lastFile === undefined) {
      props.onChange(null, null);
      return;
    }

    const buffer: ArrayBuffer = await lastFile.arrayBuffer();
    const content: string = new TextDecoder().decode(buffer);
    const extension: "json" | "yaml" = lastFile.name.split(".").pop()! as
      | "json"
      | "yaml";

    try {
      const document: unknown = extension === "json" ? JSON.parse(content) : load(content);
      const result = typia.validate<SwaggerV2.IDocument | OpenApiV3.IDocument | OpenApiV3_1.IDocument | OpenApi.IDocument>(document);
      if (result.success === false) {
        props.onChange(null, JSON.stringify(result.errors, null, 2));
        return;
      }
      else {
        props.onChange(
          OpenApi.convert(result.data),
          null,
        );
      }
    }
    catch {
      props.onChange(
        null,
        extension === "json" ? "Invalid JSON file" : "Invalid YAML file",
      );
      return;
    }
    if (array.length > 1) {
      setElements([lastFile]);
    }
  };
  return (
    <FileUpload
      defaultFiles={elements}
      onFilesChange={onChange}
      acceptedType=".json, .yaml"
      getBase64={false}
      multiFile={false}
      maxUploadFiles={1}
      title="Swagger file uploader"
      header="Drag and drop a Swagger file here"
      buttonLabel="Click Here"
      rightLabel="to select swagger.json/yaml file"
      buttonRemoveLabel="Clear"
    />
  );
}
export namespace AgenticaChatUploaderMovie {
  export interface IProps {
    onChange: (
      document: OpenApi.IDocument | null,
      error: string | null,
    ) => void;
  }
}
