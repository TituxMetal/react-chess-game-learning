import { atom } from 'nanostores'

export interface QuestionState {
  selectedAnswer: string | null
  isCorrect: boolean | null
  submitted: boolean
}

export interface StoryStats {
  totalQuestions: number
  correctAnswers: number
}

export const $questionState = atom<QuestionState>({
  selectedAnswer: null,
  isCorrect: null,
  submitted: false
})

// Track stats per story
export const $storyStats = atom<Record<string, StoryStats>>({})

export const setQuestionAnswer = (answer: string, correct: boolean): void => {
  $questionState.set({
    selectedAnswer: answer,
    isCorrect: correct,
    submitted: true
  })
}

export const recordQuestionResult = (storyId: string, correct: boolean): void => {
  const stats = $storyStats.get()
  const currentStats = stats[storyId] || { totalQuestions: 0, correctAnswers: 0 }

  $storyStats.set({
    ...stats,
    [storyId]: {
      totalQuestions: currentStats.totalQuestions + 1,
      correctAnswers: currentStats.correctAnswers + (correct ? 1 : 0)
    }
  })
}

export const getStoryStats = (storyId: string): StoryStats => {
  const stats = $storyStats.get()
  return stats[storyId] || { totalQuestions: 0, correctAnswers: 0 }
}

export const resetStoryStats = (storyId: string): void => {
  const stats = $storyStats.get()
  const { [storyId]: _, ...remaining } = stats
  $storyStats.set(remaining)
}

export const resetQuestionState = (): void => {
  $questionState.set({
    selectedAnswer: null,
    isCorrect: null,
    submitted: false
  })
}
