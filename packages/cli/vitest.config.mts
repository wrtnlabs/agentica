import { defineConfig } from 'vitest/config'
import UnpluginTypia from '@ryoppippi/unplugin-typia/vite'

export default defineConfig({
  plugins: [
    UnpluginTypia({ cache: false }),
  ],
  test: {
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
    setupFiles: ["vitest.setup.ts"],
  },
})
