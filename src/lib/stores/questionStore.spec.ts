import { beforeEach, describe, expect, it } from 'vitest'
import {
  $questionState,
  $storyStats,
  getStoryStats,
  recordQuestionResult,
  resetQuestionState,
  resetStoryStats,
  setQuestionAnswer
} from './questionStore'

describe('questionStore', () => {
  beforeEach(() => {
    // Reset stores to initial state before each test
    resetQuestionState()
    $storyStats.set({})
  })

  describe('$questionState atom', () => {
    it('should have correct initial state', () => {
      const state = $questionState.get()
      expect(state.selectedAnswer).toBeNull()
      expect(state.isCorrect).toBeNull()
      expect(state.submitted).toBe(false)
    })

    it('should have correct QuestionState interface structure', () => {
      const state = $questionState.get()
      expect(state).toHaveProperty('selectedAnswer')
      expect(state).toHaveProperty('isCorrect')
      expect(state).toHaveProperty('submitted')
    })
  })

  describe('$storyStats atom', () => {
    it('should have empty initial state', () => {
      const stats = $storyStats.get()
      expect(stats).toEqual({})
    })

    it('should be a Record<string, StoryStats>', () => {
      const stats = $storyStats.get()
      expect(typeof stats).toBe('object')
      expect(Array.isArray(stats)).toBe(false)
    })
  })

  describe('setQuestionAnswer', () => {
    it('should set correct answer with all required fields', () => {
      setQuestionAnswer('Option A', true)

      const state = $questionState.get()
      expect(state.selectedAnswer).toBe('Option A')
      expect(state.isCorrect).toBe(true)
      expect(state.submitted).toBe(true)
    })

    it('should set incorrect answer with all required fields', () => {
      setQuestionAnswer('Option B', false)

      const state = $questionState.get()
      expect(state.selectedAnswer).toBe('Option B')
      expect(state.isCorrect).toBe(false)
      expect(state.submitted).toBe(true)
    })

    it('should handle empty string answer', () => {
      setQuestionAnswer('', true)

      const state = $questionState.get()
      expect(state.selectedAnswer).toBe('')
      expect(state.isCorrect).toBe(true)
      expect(state.submitted).toBe(true)
    })

    it('should handle long answer strings', () => {
      const longAnswer =
        'This is a very long answer that might be used in complex questions with detailed explanations'
      setQuestionAnswer(longAnswer, false)

      const state = $questionState.get()
      expect(state.selectedAnswer).toBe(longAnswer)
      expect(state.isCorrect).toBe(false)
      expect(state.submitted).toBe(true)
    })

    it('should overwrite previous answer', () => {
      setQuestionAnswer('First Answer', true)
      setQuestionAnswer('Second Answer', false)

      const state = $questionState.get()
      expect(state.selectedAnswer).toBe('Second Answer')
      expect(state.isCorrect).toBe(false)
      expect(state.submitted).toBe(true)
    })

    it('should notify subscribers when state changes', () => {
      let notificationCount = 0
      const unsubscribe = $questionState.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      setQuestionAnswer('Test Answer', true)
      expect(notificationCount).toBe(1)

      setQuestionAnswer('Another Answer', false)
      expect(notificationCount).toBe(2)

      unsubscribe()
    })
  })

  describe('recordQuestionResult', () => {
    it('should create new story stats for first question', () => {
      recordQuestionResult('story-1', true)

      const stats = getStoryStats('story-1')
      expect(stats.totalQuestions).toBe(1)
      expect(stats.correctAnswers).toBe(1)
    })

    it('should increment stats for existing story with correct answer', () => {
      recordQuestionResult('story-1', true)
      recordQuestionResult('story-1', true)
      recordQuestionResult('story-1', false)

      const stats = getStoryStats('story-1')
      expect(stats.totalQuestions).toBe(3)
      expect(stats.correctAnswers).toBe(2)
    })

    it('should increment stats for existing story with incorrect answer', () => {
      recordQuestionResult('story-1', false)
      recordQuestionResult('story-1', false)

      const stats = getStoryStats('story-1')
      expect(stats.totalQuestions).toBe(2)
      expect(stats.correctAnswers).toBe(0)
    })

    it('should handle multiple different stories independently', () => {
      recordQuestionResult('story-1', true)
      recordQuestionResult('story-2', false)
      recordQuestionResult('story-1', false)
      recordQuestionResult('story-3', true)

      const stats1 = getStoryStats('story-1')
      const stats2 = getStoryStats('story-2')
      const stats3 = getStoryStats('story-3')

      expect(stats1.totalQuestions).toBe(2)
      expect(stats1.correctAnswers).toBe(1)

      expect(stats2.totalQuestions).toBe(1)
      expect(stats2.correctAnswers).toBe(0)

      expect(stats3.totalQuestions).toBe(1)
      expect(stats3.correctAnswers).toBe(1)
    })

    it('should handle empty story ID', () => {
      recordQuestionResult('', true)

      const stats = getStoryStats('')
      expect(stats.totalQuestions).toBe(1)
      expect(stats.correctAnswers).toBe(1)
    })

    it('should handle special characters in story ID', () => {
      const specialStoryId = 'story-with-special-chars-éàç-123'
      recordQuestionResult(specialStoryId, true)

      const stats = getStoryStats(specialStoryId)
      expect(stats.totalQuestions).toBe(1)
      expect(stats.correctAnswers).toBe(1)
    })

    it('should preserve other story stats when adding new ones', () => {
      recordQuestionResult('story-1', true)
      recordQuestionResult('story-2', false)

      const allStats = $storyStats.get()
      expect(Object.keys(allStats)).toHaveLength(2)
      expect(allStats['story-1']).toBeDefined()
      expect(allStats['story-2']).toBeDefined()
    })

    it('should notify subscribers when stats change', () => {
      let notificationCount = 0
      const unsubscribe = $storyStats.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      recordQuestionResult('story-1', true)
      expect(notificationCount).toBe(1)

      recordQuestionResult('story-1', false)
      expect(notificationCount).toBe(2)

      unsubscribe()
    })
  })

  describe('getStoryStats', () => {
    it('should return default stats for non-existent story', () => {
      const stats = getStoryStats('non-existent-story')
      expect(stats.totalQuestions).toBe(0)
      expect(stats.correctAnswers).toBe(0)
    })

    it('should return correct stats for existing story', () => {
      recordQuestionResult('existing-story', true)
      recordQuestionResult('existing-story', false)
      recordQuestionResult('existing-story', true)

      const stats = getStoryStats('existing-story')
      expect(stats.totalQuestions).toBe(3)
      expect(stats.correctAnswers).toBe(2)
    })

    it('should return independent stats for different stories', () => {
      recordQuestionResult('story-a', true)
      recordQuestionResult('story-b', false)

      const statsA = getStoryStats('story-a')
      const statsB = getStoryStats('story-b')

      expect(statsA.totalQuestions).toBe(1)
      expect(statsA.correctAnswers).toBe(1)

      expect(statsB.totalQuestions).toBe(1)
      expect(statsB.correctAnswers).toBe(0)
    })

    it('should handle empty string story ID', () => {
      const stats = getStoryStats('')
      expect(stats.totalQuestions).toBe(0)
      expect(stats.correctAnswers).toBe(0)
    })

    it('should return StoryStats interface structure', () => {
      const stats = getStoryStats('any-story')
      expect(stats).toHaveProperty('totalQuestions')
      expect(stats).toHaveProperty('correctAnswers')
      expect(typeof stats.totalQuestions).toBe('number')
      expect(typeof stats.correctAnswers).toBe('number')
    })
  })

  describe('resetStoryStats', () => {
    it('should remove stats for specific story', () => {
      recordQuestionResult('story-1', true)
      recordQuestionResult('story-2', false)

      resetStoryStats('story-1')

      const stats1 = getStoryStats('story-1')
      const stats2 = getStoryStats('story-2')

      expect(stats1.totalQuestions).toBe(0) // Reset to default
      expect(stats1.correctAnswers).toBe(0)

      expect(stats2.totalQuestions).toBe(1) // Preserved
      expect(stats2.correctAnswers).toBe(0)
    })

    it('should handle resetting non-existent story gracefully', () => {
      recordQuestionResult('existing-story', true)

      resetStoryStats('non-existent-story')

      const existingStats = getStoryStats('existing-story')
      expect(existingStats.totalQuestions).toBe(1) // Should remain unchanged
    })

    it('should preserve other stories when resetting one', () => {
      recordQuestionResult('story-1', true)
      recordQuestionResult('story-2', false)
      recordQuestionResult('story-3', true)

      resetStoryStats('story-2')

      const allStats = $storyStats.get()
      expect(allStats['story-1']).toBeDefined()
      expect(allStats['story-2']).toBeUndefined()
      expect(allStats['story-3']).toBeDefined()
    })

    it('should handle empty string story ID', () => {
      recordQuestionResult('', true)
      recordQuestionResult('other-story', false)

      resetStoryStats('')

      const emptyStats = getStoryStats('')
      const otherStats = getStoryStats('other-story')

      expect(emptyStats.totalQuestions).toBe(0)
      expect(otherStats.totalQuestions).toBe(1)
    })

    it('should notify subscribers when stats are reset', () => {
      recordQuestionResult('story-1', true)

      let notificationCount = 0
      const unsubscribe = $storyStats.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      resetStoryStats('story-1')
      expect(notificationCount).toBe(1)

      unsubscribe()
    })
  })

  describe('resetQuestionState', () => {
    it('should reset all question state fields to initial values', () => {
      setQuestionAnswer('Some Answer', true)

      resetQuestionState()

      const state = $questionState.get()
      expect(state.selectedAnswer).toBeNull()
      expect(state.isCorrect).toBeNull()
      expect(state.submitted).toBe(false)
    })

    it('should reset state after multiple answer changes', () => {
      setQuestionAnswer('First Answer', true)
      setQuestionAnswer('Second Answer', false)

      resetQuestionState()

      const state = $questionState.get()
      expect(state.selectedAnswer).toBeNull()
      expect(state.isCorrect).toBeNull()
      expect(state.submitted).toBe(false)
    })

    it('should not affect story stats when resetting question state', () => {
      recordQuestionResult('story-1', true)
      setQuestionAnswer('Answer', false)

      resetQuestionState()

      const questionState = $questionState.get()
      const storyStats = getStoryStats('story-1')

      expect(questionState.selectedAnswer).toBeNull()
      expect(storyStats.totalQuestions).toBe(1) // Should remain unchanged
    })

    it('should notify subscribers when state is reset', () => {
      setQuestionAnswer('Answer', true)

      let notificationCount = 0
      const unsubscribe = $questionState.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      resetQuestionState()
      expect(notificationCount).toBe(1)

      unsubscribe()
    })
  })

  describe('edge cases and error scenarios', () => {
    it('should handle rapid successive operations', () => {
      recordQuestionResult('story-1', true)
      setQuestionAnswer('Answer 1', true)
      recordQuestionResult('story-1', false)
      resetQuestionState()
      setQuestionAnswer('Answer 2', false)
      recordQuestionResult('story-2', true)

      const questionState = $questionState.get()
      const story1Stats = getStoryStats('story-1')
      const story2Stats = getStoryStats('story-2')

      expect(questionState.selectedAnswer).toBe('Answer 2')
      expect(questionState.isCorrect).toBe(false)
      expect(story1Stats.totalQuestions).toBe(2)
      expect(story1Stats.correctAnswers).toBe(1)
      expect(story2Stats.totalQuestions).toBe(1)
      expect(story2Stats.correctAnswers).toBe(1)
    })

    it('should maintain data integrity across complex workflows', () => {
      // Simulate a complete question workflow
      setQuestionAnswer('Initial Answer', true)
      recordQuestionResult('chapter-1', true)
      resetQuestionState()

      setQuestionAnswer('Second Answer', false)
      recordQuestionResult('chapter-1', false)
      resetQuestionState()

      setQuestionAnswer('Third Answer', true)
      recordQuestionResult('chapter-2', true)

      const finalQuestionState = $questionState.get()
      const chapter1Stats = getStoryStats('chapter-1')
      const chapter2Stats = getStoryStats('chapter-2')

      expect(finalQuestionState.selectedAnswer).toBe('Third Answer')
      expect(finalQuestionState.isCorrect).toBe(true)
      expect(chapter1Stats.totalQuestions).toBe(2)
      expect(chapter1Stats.correctAnswers).toBe(1)
      expect(chapter2Stats.totalQuestions).toBe(1)
      expect(chapter2Stats.correctAnswers).toBe(1)
    })

    it('should handle large numbers of questions', () => {
      const storyId = 'large-story'
      let correctCount = 0

      // Simulate 100 questions
      for (let i = 0; i < 100; i++) {
        const isCorrect = i % 3 === 0 // Every 3rd question is correct
        recordQuestionResult(storyId, isCorrect)
        if (isCorrect) correctCount++
      }

      const stats = getStoryStats(storyId)
      expect(stats.totalQuestions).toBe(100)
      expect(stats.correctAnswers).toBe(correctCount)
    })
  })
})
