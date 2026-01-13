# GoalReview - Проверка целей на реалистичность

Веб-приложение для анализа целей с помощью AI. Проверяй свои цели на реалистичность и получай детальные рекомендации по их улучшению.

## Быстрый старт

### 1. Установка зависимостей

```bash
yarn install
```

### 2. Установка и запуск Ollama

Для работы AI необходимо установить Ollama и скачать модель:

```bash
# Установка Ollama (см. OLLAMA_SETUP.md для деталей)
# Windows: скачайте с https://ollama.com/download
# macOS: brew install ollama
# Linux: curl -fsSL https://ollama.com/install.sh | sh

# Запуск Ollama
ollama serve

# Установка модели (в другом терминале)
ollama pull llama3.2
```

Подробные инструкции по установке Ollama см. в [OLLAMA_SETUP.md](./OLLAMA_SETUP.md)

### 3. Настройка переменных окружения (опционально)

Создайте файл `.env` в корне проекта:

```env
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### 4. Запуск проекта

```bash
yarn dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Структура проекта

- `app/pages/` - страницы приложения
- `app/server/api/` - серверные API роуты
- `app/types/` - TypeScript типы
- `app/assets/css/` - стили

## Использование

1. Откройте главную страницу
2. Нажмите "Проверить цель"
3. Введите свою цель и опциональные параметры
4. Получите детальный анализ с оценкой, рекомендациями и планом действий

## Технологии

- **Nuxt 4** - Vue.js фреймворк
- **Tailwind CSS** - стилизация
- **Ollama** - локальный запуск LLM моделей
- **TypeScript** - типизация

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
