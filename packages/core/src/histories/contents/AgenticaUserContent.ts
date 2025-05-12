import type { AgenticaUserAudioContent } from "./AgenticaUserAudioContent";
import type { AgenticaUserFileContent } from "./AgenticaUserFileContent";
import type { AgenticaUserImageContent } from "./AgenticaUserImageContent";
import type { AgenticaUserTextContent } from "./AgenticaUserTextContent";

export type AgenticaUserContent =
  | AgenticaUserAudioContent
  | AgenticaUserFileContent
  | AgenticaUserImageContent
  | AgenticaUserTextContent;
export namespace AgenticaUserContent {
  export type Type = AgenticaUserContent["type"];
  export interface Mapper {
    audio: AgenticaUserAudioContent;
    file: AgenticaUserFileContent;
    image: AgenticaUserImageContent;
    text: AgenticaUserTextContent;
  }
}
