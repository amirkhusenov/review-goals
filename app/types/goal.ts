export type GoalReviewRequest = {
  goal: string
  deadline?: string
  hoursPerWeek?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export type GoalReviewResponse = {
  score: number
  good: string[]
  risks: string[]
  improvements: string[]
  improved: string
  plan: string[]
}

export type ReviewApiResponse = {
  success: boolean
  review: GoalReviewResponse
}

