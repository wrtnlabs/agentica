export type ISender = ISender.User | ISender.Other | ISender.System | ISender.Assistant;

export namespace ISender {
  /**
   * My Profile.
   */
  export interface User extends Base<"user"> {}

  /**
   * Other users excluding me.
   */
  export interface Other extends Base<"other"> {
    name: string;
  }

  /**
   * System Sender.
   * Commonly used for admin or system messages.
   */
  export interface System extends Base<"system"> {
    /**
     * Name of the system.
     *
     * @default "system"
     */
    name?: string;
  }

  /**
   * Assistant Sender.
   * Commonly used for AI Profiles.
   */
  export interface Assistant extends Base<"assistant"> {
    /**
     * Name of the assistant.
     *
     * @default "assistant"
     */
    name?: string;
  }

  interface Base<T> {
    id: string;
    type: T;
    avatar?: string;
  }
}
