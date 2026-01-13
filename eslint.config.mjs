// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    files: ['**/*.vue', '**/*.ts'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      // Nuxt auto-imports composables like useUserSession from nuxt-auth-utils
      'no-undef': 'off',
    },
  }
)
