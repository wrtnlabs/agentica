import type typia from "typia";

import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaUserInputHistory extends AgenticaHistoryBase<"user_input", IAgenticaHistoryJson.IUserInput> {
  role: "user";
  contents: Array<AgenticaUserInputHistory.Contents>;
}

export namespace AgenticaUserInputHistory {
  export type Contents = Contents.File | Contents.Image | Contents.InputAudio | Contents.Text;
  export namespace Contents {
    interface ContentsBase<Type extends string> {
      /**
       * The type of the content part.
       */
      type: Type;
    }
    /**
     * Learn about
     * [text inputs](https://platform.openai.com/docs/guides/text-generation).
     */
    export interface Text extends ContentsBase<"text"> {
      /**
       * The text content.
       */
      text: string;
    }

    /**
     * Learn about [image inputs](https://platform.openai.com/docs/guides/vision).
     */
    export interface Image extends ContentsBase<"image_url"> {
      image_url: {
        /**
         * Either a URL of the image or the base64 encoded image data.
         */
        url: string & typia.tags.Format<"url">;
        /**
         * Specifies the detail level of the image. Learn more in the
         * [Vision guide](https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding).
         */
        detail?: "auto" | "high" | "low";
      };
    }

    /**
     * Learn about [audio inputs](https://platform.openai.com/docs/guides/audio).
     *
     * Note: we not recommend it because audio input data only support base64 so it's too big data.
     */
    export interface InputAudio extends ContentsBase<"input_audio"> {
      input_audio: {
        /**
         * Base64 encoded audio data.
         */
        data: string;

        /**
         * The format of the encoded audio data. Currently supports "wav" and "mp3".
         */
        format: "wav" | "mp3";
      };
    }

    /**
     * Learn about [file inputs](https://platform.openai.com/docs/guides/text) for text
     * generation.
     *
     * Note: we recommend use `file_id` instead of `file_data` because it's too big data.
     */
    export interface File extends ContentsBase<"file"> {
      file: {
        /**
         * The ID of an uploaded file to use as input.
         */
        file_id: string;
      } | {
        /**
         * The base64 encoded file data, used when passing the file to the model as a
         * string.
         */
        file_data: string;

        /**
         * The name of the file, used when passing the file to the model as a string.
         */
        filename: string;
      };
    }
  }
}
