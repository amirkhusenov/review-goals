<script setup lang="ts">
import type { GoalReviewResponse, ReviewApiResponse } from '~/types/goal'

const goal = ref('')
const deadline = ref('')
const hoursPerWeek = ref('')
const level = ref<'beginner' | 'intermediate' | 'advanced'>('beginner')
const isLoading = ref(false)
const reviewResult = ref<GoalReviewResponse | null>(null)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  if (!goal.value.trim()) return

  isLoading.value = true
  error.value = null
  reviewResult.value = null

  try {
    const data = await $fetch<ReviewApiResponse>('/api/review', {
      method: 'POST',
      body: {
        goal: goal.value,
        deadline: deadline.value || undefined,
        hoursPerWeek: hoursPerWeek.value || undefined,
        level: level.value
      }
    })

    if (data?.success && data.review) {
      reviewResult.value = data.review
    } else {
      throw new Error('Не удалось получить анализ цели')
    }
  } catch (err: unknown) {
    const errorObj = err as { data?: { message?: string }; message?: string }
    error.value = errorObj.data?.message || errorObj.message || 'Произошла ошибка при анализе цели'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  goal.value = ''
  deadline.value = ''
  hoursPerWeek.value = ''
  level.value = 'beginner'
  reviewResult.value = null
  error.value = null
}

const handlePrint = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

const getScoreColor = (score: number) => {
  if (score >= 8) return 'from-emerald-500 to-emerald-400'
  if (score >= 5) return 'from-amber-500 to-amber-400'
  return 'from-red-500 to-red-400'
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
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="pt-28 pb-20">
      <div class="max-w-2xl mx-auto px-6">
        <!-- Header -->
        <div class="text-center mb-12 animate-fade-in">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Проверь свою цель
          </h1>
          <p class="text-lg text-zinc-400">
            Опиши цель, и AI проанализирует её на реалистичность
          </p>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-8 p-5 rounded-xl bg-red-500/10 border border-red-500/20 animate-slide-up"
        >
          <div class="flex items-start gap-4">
            <Icon name="mdi:alert-circle" class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-red-400 font-medium mb-1">Ошибка</p>
              <p class="text-zinc-400 text-sm">{{ error }}</p>
              <p class="text-zinc-500 text-xs mt-2">
                Убедитесь, что Ollama запущен: <code class="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300">ollama serve</code>
              </p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div v-if="!reviewResult" class="animate-slide-up delay-100">
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-8">
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <!-- Goal Textarea -->
              <div>
                <label for="goal" class="block text-sm font-medium text-white mb-2">
                  Твоя цель <span class="text-zinc-500">*</span>
                </label>
                <textarea
                  id="goal"
                  v-model="goal"
                  rows="4"
                  placeholder="Например: Научиться играть на гитаре за 3 месяца"
                  class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                  required
                />
              </div>

              <!-- Optional Fields -->
              <div class="grid sm:grid-cols-3 gap-4">
                <div>
                  <label for="deadline" class="block text-sm font-medium text-white mb-2">Срок</label>
                  <input
                    id="deadline"
                    v-model="deadline"
                    type="text"
                    placeholder="3 месяца"
                    class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  >
                </div>
                <div>
                  <label for="hoursPerWeek" class="block text-sm font-medium text-white mb-2">Часов в неделю</label>
                  <input
                    id="hoursPerWeek"
                    v-model="hoursPerWeek"
                    type="text"
                    placeholder="5 часов"
                    class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  >
                </div>
                <div>
                  <label for="level" class="block text-sm font-medium text-white mb-2">Уровень</label>
                  <select
                    id="level"
                    v-model="level"
                    class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-600"
                  >
                    <option value="beginner">Начинающий</option>
                    <option value="intermediate">Средний</option>
                    <option value="advanced">Продвинутый</option>
                  </select>
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="isLoading || !goal.trim()"
                class="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-semibold rounded-xl text-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <template v-if="isLoading">
                  <Icon name="mdi:loading" class="w-5 h-5 animate-spin" />
                  <span>Анализирую...</span>
                </template>
                <template v-else>
                  <span>Проверить цель</span>
                  <Icon name="mdi:arrow-right" class="w-5 h-5" />
                </template>
              </button>
            </form>

            <!-- Loading State -->
            <div v-if="isLoading" class="mt-10 text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
                <Icon name="mdi:loading" class="w-8 h-8 text-white animate-spin" />
              </div>
              <p class="text-zinc-400">AI анализирует твою цель...</p>
              <p class="text-zinc-600 text-sm mt-1">Это может занять до 30 секунд</p>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div v-if="reviewResult" class="space-y-6 animate-fade-in">
          <!-- Goal Card -->
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <p class="text-zinc-500 text-sm mb-2">Твоя цель</p>
            <p class="text-white text-lg">{{ goal }}</p>
          </div>

          <!-- Score Card -->
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-zinc-400">Оценка реалистичности</span>
              <span class="text-3xl font-bold text-white">{{ reviewResult.score }}/10</span>
            </div>
            <div class="h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full bg-gradient-to-r transition-all duration-700"
                :class="getScoreColor(reviewResult.score)"
                :style="{ width: `${reviewResult.score * 10}%` }"
              />
            </div>
          </div>

          <!-- Good & Risks -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="mdi:check-circle" class="w-5 h-5 text-emerald-400" />
                <span class="font-semibold text-emerald-400">Что хорошо</span>
              </div>
              <ul class="space-y-2">
                <li
                  v-for="item in reviewResult.good"
                  :key="item"
                  class="text-zinc-300 text-sm flex items-start gap-2"
                >
                  <span class="text-emerald-400 mt-1">•</span>
                  {{ item }}
                </li>
              </ul>
            </div>

            <div class="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div class="flex items-center gap-2 mb-4">
                <Icon name="mdi:alert" class="w-5 h-5 text-amber-400" />
                <span class="font-semibold text-amber-400">Риски</span>
              </div>
              <ul class="space-y-2">
                <li
                  v-for="item in reviewResult.risks"
                  :key="item"
                  class="text-zinc-300 text-sm flex items-start gap-2"
                >
                  <span class="text-amber-400 mt-1">•</span>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Improvements -->
          <div class="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div class="flex items-center gap-2 mb-4">
              <Icon name="mdi:wrench" class="w-5 h-5 text-purple-400" />
              <span class="font-semibold text-purple-400">Как улучшить</span>
            </div>
            <ul class="space-y-2">
              <li
                v-for="item in reviewResult.improvements"
                :key="item"
                class="text-zinc-300 text-sm flex items-start gap-2"
              >
                <span class="text-purple-400 mt-1">•</span>
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- Improved Goal -->
          <div class="p-5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div class="flex items-center gap-2 mb-4">
              <Icon name="mdi:lightbulb" class="w-5 h-5 text-blue-400" />
              <span class="font-semibold text-blue-400">Улучшенная формулировка</span>
            </div>
            <p class="text-zinc-200 leading-relaxed">{{ reviewResult.improved }}</p>
          </div>

          <!-- Plan -->
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
            <div class="flex items-center gap-2 mb-6">
              <Icon name="mdi:map-marker-path" class="w-5 h-5 text-zinc-400" />
              <span class="font-semibold text-white">План действий</span>
            </div>
            <ol class="space-y-4">
              <li
                v-for="(step, index) in reviewResult.plan"
                :key="index"
                class="flex items-start gap-4"
              >
                <span class="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-sm font-medium">
                  {{ index + 1 }}
                </span>
                <span class="text-zinc-300 pt-1">{{ step }}</span>
              </li>
            </ol>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              class="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors"
              @click="resetForm"
            >
              <Icon name="mdi:refresh" class="w-5 h-5" />
              Проверить другую цель
            </button>
            <button
              class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-900 transition-colors"
              @click="handlePrint"
            >
              <Icon name="mdi:download" class="w-5 h-5" />
              Сохранить
            </button>
          </div>
        </div>

        <!-- CTA: Create account -->
        <div class="mt-12 animate-fade-in">
          <div class="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/80 via-zinc-900/60 to-zinc-900/80 px-6 py-6 md:px-8 md:py-7">
            <div class="flex flex-col gap-4">
              <div>
                <p class="text-sm font-medium text-zinc-400 uppercase tracking-[0.18em] mb-2">
                  Сохраняй прогресс
                </p>
                <h2 class="text-lg md:text-xl font-semibold text-white mb-1">
                  Если хочешь сохранять результаты и отслеживать прогресс по цели — создай аккаунт
                </h2>
                <p class="text-sm text-zinc-500">
                  История анализов, эволюция формулировок целей и планы в одном месте.
                </p>
              </div>
              <div class="flex flex-col gap-3 justify-center">
                <NuxtLink
                  to="/register"
                  class="inline-flex items-center justify-center px-5 py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Создать аккаунт
                </NuxtLink>
                <NuxtLink
                  to="/login"
                  class="inline-flex items-center justify-center px-5 py-3 border border-zinc-700 text-sm font-medium text-white rounded-xl hover:bg-zinc-900 transition-colors"
                >
                  Войти
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
