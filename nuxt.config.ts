// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/eslint',
    'nuxt-auth-utils'
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  css: ['~/assets/css/main.css'],

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700] }
    ]
  },

  runtimeConfig: {
    // Supabase (server-side) - используем SUPABASE_KEY из .env
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY,
    // OAuth secrets (optional - только если указаны в .env)
    oauth: {
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET || ''
      },
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID || '',
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET || ''
      }
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      password: process.env.NUXT_SESSION_PASSWORD || 'default-session-password-change-in-production'
    },
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
      // OAuth availability flags
      oauthGoogleEnabled: !!(process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID && process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET),
      oauthGithubEnabled: !!(process.env.NUXT_OAUTH_GITHUB_CLIENT_ID && process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET),
      ollamaUrl: 'http://localhost:11434',
      ollamaModel: 'llama3.2'
    }
  }
})
