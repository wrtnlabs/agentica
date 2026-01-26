/**
 * Configuration for Agentic Agent.
 *
 * `IAgenticaConfig` is an interface that defines the configuration
 * properties of the {@link Agentica}. With this configuration, you
 * can set the user's {@link locale}, {@link timezone}, and some of
 * {@link systemPrompt system prompts}.
 *
 * Also, you can affect to the LLM function selecing/calling logic by
 * configuring additional properties. For an example, if you configure the
 * {@link capacity} property, the AI chatbot will divide the functions
 * into the several groups with the configured capacity and select proper
 * functions to call by operating the multiple LLM function selecting
 * agents parallelly.
 *
 * @author sunrabbit123
 */
export interface IAgenticaConfigBase {

  /**
   * Locale of the A.I. chatbot.
   *
   * If you configure this property, the A.I. chatbot will conversate with
   * the given locale. You can get the locale value by
   *
   * - Browser: `navigator.language`
   * - NodeJS: `process.env.LANG.split(".")[0]`
   *
   * @default your_locale
   */
  locale?: string;

  /**
   * Timezone of the A.I. chatbot.
   *
   * If you configure this property, the A.I. chatbot will consider the
   * given timezone. You can get the timezone value by
   * `Intl.DateTimeFormat().resolvedOptions().timeZone`.
   *
   * @default your_timezone
   */
  timezone?: string;

  /**
   * Retry count.
   *
   * If LLM function calling composed arguments are invalid,
   * the A.I. chatbot will retry to call the function with
   * the modified arguments.
   *
   * By the way, if you configure it to 0 or 1, the A.I. chatbot
   * will not retry the LLM function calling for correcting the
   * arguments.
   *
   * @default 3
   */
  retry?: number;

  /**
   * Backoff strategy.
   *
   * If OpenAI SDK fails to connect LLM API Server, this Backoff factor
   * would be used to retry for the next connection.
   *
   * If the function returns `true`, the retry would be stopped.
   * Otherwise, the retry would be continued.
   *
   * @default (props) => throw props.error
   * @returns {number} The number of milliseconds to wait before the next retry
   * @throws {Error} If the function want to stop the retry, you can throw an error
   */
  backoffStrategy?: (props: {
    count: number;
    error: unknown;
  }) => number;

  /**
   * Whether to enable streaming.
   *
   * If you set this property to `true`, the A.I. chatbot will enable streaming.
   *
   * If you set this property to `false`, the A.I. chatbot will not enable streaming.
   *
   * @default true
   */
  stream?: boolean;
}
