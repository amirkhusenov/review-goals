<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession()

type GoalHistoryItem = {
  id: number
  goal: string
  score: number
  date: string
  improved: boolean
}

// Redirect if not logged in
watchEffect(() => {
  if (!loggedIn.value) {
    navigateTo('/login')
  }
})

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  navigateTo('/')
}

// История целей (пока без данных, позже подключим бэкенд)
const goalHistory = ref<GoalHistoryItem[]>([])

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-emerald-400'
  if (score >= 5) return 'text-amber-400'
  return 'text-red-400'
}

const getScoreBg = (score: number) => {
  if (score >= 8) return 'bg-emerald-500/10 border-emerald-500/20'
  if (score >= 5) return 'bg-amber-500/10 border-amber-500/20'
  return 'bg-red-500/10 border-red-500/20'
}
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="flex items-center gap-2">
            <Icon name="mdi:target" class="w-6 h-6 text-white" />
            <span class="text-lg font-semibold text-white">GoalReview</span>
          </NuxtLink>
          
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/review"
              class="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Проверить цель
            </NuxtLink>
            
            <!-- User Menu -->
            <div v-if="user" class="flex items-center gap-3">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="w-8 h-8 rounded-full border border-zinc-700"
              >
              <button
                class="text-sm text-zinc-400 hover:text-white transition-colors"
                @click="handleLogout"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-28 pb-20">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Header -->
        <div class="mb-10">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
            Привет, {{ user?.name?.split(' ')[0] || 'Пользователь' }}! 👋
          </h1>
          <p class="text-zinc-400">
            Здесь ты можешь отслеживать прогресс своих целей
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-10">
          <div class="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
            <div class="text-3xl font-bold text-white mb-1">{{ goalHistory.length }}</div>
            <div class="text-sm text-zinc-500">Целей проверено</div>
          </div>
          <div class="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
            <div class="text-3xl font-bold text-emerald-400 mb-1">
              {{ goalHistory.filter(g => g.score >= 7).length }}
            </div>
            <div class="text-sm text-zinc-500">Хороших целей</div>
          </div>
          <div class="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
            <div class="text-3xl font-bold text-white mb-1">
              {{ goalHistory.filter(g => g.improved).length }}
            </div>
            <div class="text-sm text-zinc-500">Улучшено</div>
          </div>
        </div>

        <!-- Quick Action -->
        <NuxtLink
          to="/review"
          class="block w-full p-6 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 hover:border-zinc-600 transition-colors mb-10"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-white mb-1">Проверить новую цель</h3>
              <p class="text-sm text-zinc-400">Получи AI-анализ за 60 секунд</p>
            </div>
            <Icon name="mdi:arrow-right" class="w-6 h-6 text-zinc-400" />
          </div>
        </NuxtLink>

        <!-- History -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-6">История целей</h2>
          
          <div v-if="goalHistory.length === 0" class="text-center py-12">
            <Icon name="mdi:target" class="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p class="text-zinc-500">Пока нет проверенных целей</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="item in goalHistory"
              :key="item.id"
              class="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="text-white mb-2">{{ item.goal }}</p>
                  <div class="flex items-center gap-4 text-sm">
                    <span class="text-zinc-500">{{ item.date }}</span>
                    <span
                      v-if="item.improved"
                      class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs"
                    >
                      Улучшено
                    </span>
                  </div>
                </div>
                <div
                  class="px-3 py-1.5 rounded-lg border text-sm font-medium"
                  :class="getScoreBg(item.score)"
                >
                  <span :class="getScoreColor(item.score)">{{ item.score }}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
