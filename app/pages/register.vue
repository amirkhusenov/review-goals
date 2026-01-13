<script setup lang="ts">
const config = useRuntimeConfig()
const { loggedIn } = useUserSession()

// Redirect if already logged in
watchEffect(() => {
  if (loggedIn.value) {
    navigateTo('/dashboard')
  }
})

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const formError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const oauthGoogleEnabled = config.public.oauthGoogleEnabled
const oauthGithubEnabled = config.public.oauthGithubEnabled
const hasOAuth = oauthGoogleEnabled || oauthGithubEnabled

const handleSubmit = async () => {
  formError.value = null
  successMessage.value = null

  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    formError.value = 'Заполните все поля'
    return
  }

  if (password.value.length < 6) {
    formError.value = 'Пароль должен быть не менее 6 символов'
    return
  }

  if (password.value !== confirmPassword.value) {
    formError.value = 'Пароли не совпадают'
    return
  }

  isLoading.value = true

  try {
    const result = await $fetch<{ success: boolean; requiresEmailConfirmation?: boolean }>('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value
      }
    })

    if (result.requiresEmailConfirmation) {
      successMessage.value = 'Регистрация успешна! Проверьте почту для подтверждения email.'
      // Не редиректим, показываем сообщение
    } else {
      // Редирект на dashboard
      await navigateTo('/dashboard')
    }
  } catch (err: unknown) {
    const errorObj = err as { data?: { message?: string } }
    formError.value = errorObj.data?.message || 'Ошибка регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-black flex flex-col">
    <!-- Navigation -->
    <nav class="border-b border-zinc-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center gap-2">
            <Icon name="mdi:target" class="w-6 h-6 text-white" />
            <span class="text-lg font-semibold text-white">GoalReview</span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Register Form -->
    <div class="flex-1 flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">
            Создать аккаунт
          </h1>
          <p class="text-zinc-400">
            Зарегистрируйтесь, чтобы сохранять историю целей
          </p>
        </div>

        <!-- Success Message -->
        <div
          v-if="successMessage"
          class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <div class="flex items-center gap-3">
            <Icon name="mdi:check-circle" class="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p class="text-emerald-400 text-sm">{{ successMessage }}</p>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="formError"
          class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <div class="flex items-center gap-3">
            <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-400 flex-shrink-0" />
            <p class="text-red-400 text-sm">{{ formError }}</p>
          </div>
        </div>

        <!-- Email/Password Form -->
        <form v-if="!successMessage" class="space-y-4 mb-6" @submit.prevent="handleSubmit">
          <div>
            <label for="name" class="block text-sm font-medium text-white mb-2">Имя</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Ваше имя"
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              required
            >
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-white mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              required
            >
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-white mb-2">Пароль</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Минимум 6 символов"
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              required
            >
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-white mb-2">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              required
            >
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-6 py-4 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <span v-if="isLoading">Регистрация...</span>
            <span v-else>Зарегистрироваться</span>
          </button>
        </form>

        <!-- Login Link -->
        <p class="text-center text-zinc-400 text-sm mb-6">
          Уже есть аккаунт?
          <NuxtLink to="/login" class="text-white hover:underline">
            Войти
          </NuxtLink>
        </p>

        <!-- Divider and OAuth Buttons (only if OAuth is configured) -->
        <template v-if="hasOAuth && !successMessage">
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-zinc-800" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-black text-zinc-500">или через</span>
            </div>
          </div>

          <!-- OAuth Buttons -->
          <div class="space-y-3">
            <!-- Google -->
            <a
              v-if="oauthGoogleEnabled"
              href="/auth/google"
              class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-zinc-900 text-white font-medium rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </a>

            <!-- GitHub -->
            <a
              v-if="oauthGithubEnabled"
              href="/auth/github"
              class="w-full flex items-center justify-center gap-3 px-6 py-3 bg-zinc-900 text-white font-medium rounded-xl border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </template>

        <!-- Terms -->
        <p class="mt-8 text-center text-xs text-zinc-600">
          Регистрируясь, вы соглашаетесь с
          <NuxtLink to="/terms" class="text-zinc-400 hover:text-white transition-colors">
            Условиями использования
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
