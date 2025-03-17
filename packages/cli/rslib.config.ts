import { defineConfig } from '@rslib/core';
import UnpluginTypia from '@ryoppippi/unplugin-typia/rspack';

export default defineConfig({
  tools: {
    rspack: {
      plugins: [
        UnpluginTypia({ cache: false }),
      ],
    },
  },
  source: {
    entry: {
      index: [
        './src/index.ts',
      ],
    },
  },
  lib: [
    {
      format: 'cjs',
      bundle: true,
      output: {
        distPath: {
          root: './bin',
        },
        minify: true,
      },
    },
  ],
});
