import type { OpenApi } from "@typia/interface";

import { OpenApiConverter } from "@typia/utils";
import { load } from "js-yaml";
import React from "react";
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import FileUpload from "react-mui-fileuploader";

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
    const lastFile: ExtendedFileProps | undefined = array[array.length - 1];
    if (lastFile === undefined) {
      props.onChange(null, null);
      return;
    }

    const buffer: ArrayBuffer = await lastFile.arrayBuffer();
    const content: string = new TextDecoder().decode(buffer);
    const isJson: boolean
      = (lastFile.name.split(".").pop() ?? "").toLowerCase() === "json";

    // PARSE THE RAW FILE (JSON or YAML)
    let document: unknown;
    try {
      document = isJson ? JSON.parse(content) : load(content);
    }
    catch {
      props.onChange(
        null,
        isJson ? "Invalid JSON file." : "Invalid YAML file.",
      );
      return;
    }

    // CONVERT TO THE EMENDED OPENAPI DOCUMENT
    //
    // Do not run a strict `typia.validate()` here. `OpenApiConverter` (the
    // very same converter that `Agentica`/`HttpLlm` rely on) only needs the
    // `swagger`/`openapi` version property, and accepts real-world
    // specifications leniently. A strict validation would reject lots of
    // perfectly usable Swagger/OpenAPI documents, blocking the uploader.
    try {
      props.onChange(
        OpenApiConverter.upgradeDocument(
          document as Parameters<typeof OpenApiConverter.upgradeDocument>[0],
        ),
        null,
      );
    }
    catch (error) {
      props.onChange(
        null,
        error instanceof Error
          ? error.message
          : "Not a valid Swagger/OpenAPI document.",
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
