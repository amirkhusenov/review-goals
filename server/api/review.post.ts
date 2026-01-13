import type { GoalReviewRequest, GoalReviewResponse } from '~/types/goal'

export default defineEventHandler(async (event) => {
    const body = await readBody<GoalReviewRequest>(event)

    if (!body.goal || !body.goal.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Цель обязательна для заполнения'
        })
    }

    // Ollama API endpoint (по умолчанию localhost:11434)
    const config = useRuntimeConfig(event)
    const ollamaUrl = config.public.ollamaUrl || 'http://localhost:11434'
    const model = config.public.ollamaModel || 'llama3.2' // или mistral, llama3, и т.д.

    // Промпт для анализа цели
    const prompt = `Ты эксперт по постановке целей. Проанализируй следующую цель на реалистичность и дай структурированный ответ в формате JSON.

Цель: "${body.goal}"
${body.deadline ? `Срок: ${body.deadline}` : ''}
${body.hoursPerWeek ? `Время в неделю: ${body.hoursPerWeek}` : ''}
${body.level ? `Уровень: ${body.level}` : ''}

Верни ответ ТОЛЬКО в формате JSON без дополнительного текста:
{
  "score": число от 1 до 10,
  "good": ["что хорошо 1", "что хорошо 2"],
  "risks": ["риск 1", "риск 2"],
  "improvements": ["улучшение 1", "улучшение 2"],
  "improved": "улучшенная формулировка цели",
  "plan": ["шаг 1", "шаг 2", "шаг 3"]
}

Оцени цель по реалистичности, укажи что хорошо, какие есть риски, как можно улучшить, предложи улучшенную формулировку и реалистичный план действий.`

    try {
        // Вызов Ollama API
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9
                }
            })
        })

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`)
        }

        const data = await response.json()
        const aiResponse = data.response || ''

        // Парсинг JSON из ответа AI
        let reviewResult: GoalReviewResponse

        try {
            // Извлекаем JSON из ответа (может быть обернут в текст)
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                reviewResult = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('JSON not found in response')
            }
        } catch (parseError) {
            // Если не удалось распарсить, возвращаем базовую структуру
            console.error('Failed to parse AI response:', aiResponse)
            reviewResult = {
                score: 5,
                good: ['Цель сформулирована'],
                risks: ['Требуется дополнительный анализ'],
                improvements: ['Уточнить детали цели'],
                improved: body.goal,
                plan: ['Шаг 1: Начать работу над целью', 'Шаг 2: Отслеживать прогресс']
            }
        }

        // Валидация результата
        if (!reviewResult.score || reviewResult.score < 1 || reviewResult.score > 10) {
            reviewResult.score = 5
        }

        return {
            success: true,
            review: reviewResult
        }
    } catch (error) {
        console.error('Error calling Ollama:', error)

        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : 'Ошибка при анализе цели. Убедитесь, что Ollama запущен.'
        })
    }
})

