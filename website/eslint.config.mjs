import { wrtnlabsNext } from '@wrtnlabs/eslint-config/next'

export default wrtnlabsNext({
  tailwindcss: false, // eslint-plugin-tailwindcss is not compatible with v4 yet
})
