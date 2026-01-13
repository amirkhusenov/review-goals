<script setup lang="ts">
const router = useRouter()
const { loggedIn, user } = useUserSession()

const handleCheckGoal = () => {
  router.push('/review')
}

const features = [
  {
    icon: 'mdi:target',
    title: 'Точный анализ',
    description: 'AI оценивает цель по 10+ критериям реалистичности.'
  },
  {
    icon: 'mdi:chart-line',
    title: 'Детальная оценка',
    description: 'Оценка от 1 до 10 с объяснением сильных и слабых сторон.'
  },
  {
    icon: 'mdi:lightbulb-outline',
    title: 'Улучшенная формулировка',
    description: 'AI предложит улучшенную версию твоей цели.'
  },
  {
    icon: 'mdi:map-marker-path',
    title: 'План действий',
    description: 'Пошаговый план достижения цели.'
  },
  {
    icon: 'mdi:alert-circle-outline',
    title: 'Выявление рисков',
    description: 'Потенциальные препятствия и как их избежать.'
  },
  {
    icon: 'mdi:clock-outline',
    title: 'За 60 секунд',
    description: 'Быстрый анализ без регистрации.'
  }
]

const categories = [
  { icon: 'mdi:briefcase-outline', title: 'Карьера', description: 'Продвижение, навыки' },
  { icon: 'mdi:school-outline', title: 'Учёба', description: 'Курсы, знания' },
  { icon: 'mdi:heart-outline', title: 'Здоровье', description: 'Спорт, привычки' },
  { icon: 'mdi:currency-usd', title: 'Финансы', description: 'Накопления, доходы' }
]

const exampleGoal = 'Научиться играть на гитаре за 3 месяца'
const exampleScore = 7
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center gap-2">
            <Icon name="mdi:target" class="w-6 h-6 text-white" />
            <span class="text-lg font-semibold text-white">GoalReview</span>
          </div>
          <div class="flex items-center gap-4">
            <!-- Logged in -->
            <template v-if="loggedIn">
              <NuxtLink
                to="/dashboard"
                class="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <img
                  v-if="user?.avatar"
                  :src="user.avatar"
                  :alt="user.name"
                  class="w-7 h-7 rounded-full border border-zinc-700"
                >
                <span class="hidden sm:inline">{{ user?.name?.split(' ')[0] }}</span>
              </NuxtLink>
            </template>
            <!-- Not logged in -->
            <template v-else>
              <NuxtLink
                to="/login"
                class="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Войти
              </NuxtLink>
            </template>
            <button
              class="px-5 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-zinc-200 transition-colors"
              @click="handleCheckGoal"
            >
              Проверить цель
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-24">
      <div class="max-w-6xl mx-auto px-6 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 mb-8 animate-fade-in">
          <span>✨</span>
          <span>AI-анализ целей</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
          Проверь свою цель<br>
          на реалистичность
        </h1>

        <!-- Subtitle -->
        <p class="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto animate-slide-up delay-100">
          AI подскажет, где ты себя обманываешь и как улучшить цель. 
          Получи детальный анализ за 60 секунд.
        </p>

        <!-- CTA Button -->
        <div class="animate-slide-up delay-200">
          <button
            class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg text-lg hover:bg-zinc-200 transition-colors"
            @click="handleCheckGoal"
          >
            Начать анализ
            <Icon name="mdi:arrow-right" class="w-5 h-5" />
          </button>
        </div>

        <!-- Example Preview -->
        <div class="mt-20 max-w-3xl mx-auto animate-slide-up delay-300">
          <div class="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <!-- Window Header -->
            <div class="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500" />
                <div class="w-3 h-3 rounded-full bg-yellow-500" />
                <div class="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span class="text-sm text-zinc-500 ml-2">goalreview.ai</span>
            </div>
            
            <!-- Content -->
            <div class="p-6 md:p-8">
              <!-- Goal -->
              <div class="mb-6">
                <p class="text-zinc-500 text-xs uppercase tracking-wider mb-2">Твоя цель</p>
                <p class="text-white text-lg">{{ exampleGoal }}</p>
              </div>

              <!-- Score -->
              <div class="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-800">
                <div class="text-4xl font-bold text-white">{{ exampleScore }}/10</div>
                <div class="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    :style="{ width: `${exampleScore * 10}%` }"
                  />
                </div>
              </div>

              <!-- Analysis Grid -->
              <div class="grid md:grid-cols-2 gap-3 mb-4">
                <!-- Good -->
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-base">🟢</span>
                    <span class="text-sm font-medium text-emerald-400">Что хорошо</span>
                  </div>
                  <ul class="space-y-1 text-sm text-zinc-300">
                    <li>• Конкретный навык</li>
                    <li>• Реалистичный срок</li>
                  </ul>
                </div>

                <!-- Risks -->
                <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-base">🔴</span>
                    <span class="text-sm font-medium text-amber-400">Риски</span>
                  </div>
                  <ul class="space-y-1 text-sm text-zinc-300">
                    <li>• Не указано время в неделю</li>
                    <li>• Нет промежуточных этапов</li>
                  </ul>
                </div>
              </div>

              <!-- How to improve -->
              <div class="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-base">🔧</span>
                  <span class="text-sm font-medium text-purple-400">Как улучшить</span>
                </div>
                <ul class="space-y-1 text-sm text-zinc-300">
                  <li>• Добавить конкретные песни для изучения</li>
                  <li>• Определить время практики в неделю</li>
                  <li>• Разбить на этапы: аккорды → простые песни</li>
                </ul>
              </div>

              <!-- Improved Goal -->
              <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-base">✍️</span>
                  <span class="text-sm font-medium text-blue-400">Улучшенная формулировка</span>
                </div>
                <p class="text-sm text-zinc-300 leading-relaxed">
                  За 3 месяца научиться играть 5 простых песен на гитаре, занимаясь по 3 часа в неделю.
                </p>
              </div>

              <!-- Plan -->
              <div class="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-base">🧭</span>
                  <span class="text-sm font-medium text-zinc-300">Реалистичный план</span>
                </div>
                <ol class="space-y-2 text-sm text-zinc-400">
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs">1</span>
                    <span>Неделя 1-2: Базовые аккорды (Am, C, D, G)</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs">2</span>
                    <span>Неделя 3-4: Первая песня с простым ритмом</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <span class="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-700 text-zinc-300 flex items-center justify-center text-xs">3</span>
                    <span>Месяц 2-3: Ещё 4 песни, работа над техникой</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-24 bg-zinc-950">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Для любой сферы жизни
          </h2>
          <p class="text-zinc-400 text-lg">
            Проверяй цели в карьере, учёбе, здоровье и финансах
          </p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="category in categories"
            :key="category.title"
            class="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center cursor-pointer hover:border-zinc-700 hover:bg-zinc-900 transition-all"
            @click="handleCheckGoal"
          >
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <Icon :name="category.icon" class="w-6 h-6 text-zinc-400" />
            </div>
            <h3 class="text-lg font-semibold text-white mb-1">{{ category.title }}</h3>
            <p class="text-sm text-zinc-500">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24">
      <div class="max-w-6xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
            Что ты получишь
          </h2>
          <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
            Детальный анализ твоей цели с конкретными рекомендациями
          </p>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all"
          >
            <Icon :name="feature.icon" class="w-6 h-6 text-zinc-400 mb-4" />
            <h3 class="text-lg font-semibold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-zinc-500 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-zinc-950">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Готов проверить свою цель?
        </h2>
        <p class="text-xl text-zinc-400 mb-10">
          Без регистрации. Бесплатно. Результат за 60 секунд.
        </p>
        <button
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-lg text-lg hover:bg-zinc-200 transition-colors"
          @click="handleCheckGoal"
        >
          Начать анализ
          <Icon name="mdi:arrow-right" class="w-5 h-5" />
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-zinc-900 py-12">
      <div class="max-w-6xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-2">
            <Icon name="mdi:target" class="w-5 h-5 text-zinc-500" />
            <span class="text-zinc-500 font-medium">GoalReview</span>
          </div>
          <p class="text-sm text-zinc-600">
            © 2025 GoalReview. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
