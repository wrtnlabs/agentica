import type { AgenticaUserMessageContentBase } from "./AgenticaUserMessageContentBase";

/**
 * Audio content by user.
 *
 * @reference https://platform.openai.com/docs/guides/audio
 * @warning We not recommend it because audio data only support base64
 *          so it's too big data
 * @author SunRabbit
 */
export interface AgenticaUserMessageAudioContent extends AgenticaUserMessageContentBase<"audio"> {
  /**
   * Base64 encoded audio data.
   */
  data: string;

  /**
   * The format of the encoded audio data. Currently supports "wav" and "mp3".
   */
  format: "wav" | "mp3";
}
