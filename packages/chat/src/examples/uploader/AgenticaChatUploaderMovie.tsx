import { validateHttpLlmApplication } from "@agentica/core";
import { load } from "js-yaml";
import React from "react";
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import FileUpload from "react-mui-fileuploader";

import type { IHttpLlmApplication } from "@samchon/openapi";
import type { IValidation } from "typia";

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
      const application: IValidation<IHttpLlmApplication<"chatgpt">>
        = validateHttpLlmApplication({
          model: "chatgpt",
          document,
          options: {
            reference: true,
          },
        });
      if (application.success === true) {
        props.onChange(application.data, null);
      }
      else { props.onChange(null, JSON.stringify(application.errors, null, 2)); }
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
      application: IHttpLlmApplication<"chatgpt"> | null,
      error: string | null,
    ) => void;
  }
}
