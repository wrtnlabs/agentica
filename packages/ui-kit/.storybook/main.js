import UnpluginTypia from "@ryoppippi/unplugin-typia/vite"

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal (config){
    const { mergeConfig } = await import ("vite")

    return mergeConfig(config, {
      plugins: [
        UnpluginTypia()
      ]
    })
  }
};
export default config;