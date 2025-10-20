import { beforeEach, describe, expect, it } from 'vitest'
import {
  isChapterComplete,
  markChapterComplete,
  progressStore,
  setCurrentChapter,
  type Progress
} from './progressStore'

describe('progressStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    progressStore.set({
      completedChapters: new Set(),
      currentStory: null,
      currentChapter: null
    })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const progress = progressStore.get()
      expect(progress.completedChapters).toBeInstanceOf(Set)
      expect(progress.completedChapters.size).toBe(0)
      expect(progress.currentStory).toBeNull()
      expect(progress.currentChapter).toBeNull()
    })

    it('should have correct Progress interface structure', () => {
      const progress = progressStore.get()
      expect(progress).toHaveProperty('completedChapters')
      expect(progress).toHaveProperty('currentStory')
      expect(progress).toHaveProperty('currentChapter')
    })
  })

  describe('markChapterComplete', () => {
    it('should mark a chapter as complete', () => {
      markChapterComplete('story-1', 'chapter-1')

      const progress = progressStore.get()
      expect(progress.completedChapters.has('story-1-chapter-1')).toBe(true)
      expect(progress.completedChapters.size).toBe(1)
    })

    it('should mark multiple chapters as complete', () => {
      markChapterComplete('story-1', 'chapter-1')
      markChapterComplete('story-1', 'chapter-2')
      markChapterComplete('story-2', 'chapter-1')

      const progress = progressStore.get()
      expect(progress.completedChapters.has('story-1-chapter-1')).toBe(true)
      expect(progress.completedChapters.has('story-1-chapter-2')).toBe(true)
      expect(progress.completedChapters.has('story-2-chapter-1')).toBe(true)
      expect(progress.completedChapters.size).toBe(3)
    })

    it('should handle duplicate chapter completion gracefully', () => {
      markChapterComplete('story-1', 'chapter-1')
      markChapterComplete('story-1', 'chapter-1') // Duplicate

      const progress = progressStore.get()
      expect(progress.completedChapters.has('story-1-chapter-1')).toBe(true)
      expect(progress.completedChapters.size).toBe(1) // Should still be 1
    })

    it('should preserve existing completed chapters when adding new ones', () => {
      markChapterComplete('story-1', 'chapter-1')
      markChapterComplete('story-2', 'chapter-1')

      const progress = progressStore.get()
      expect(progress.completedChapters.has('story-1-chapter-1')).toBe(true)
      expect(progress.completedChapters.has('story-2-chapter-1')).toBe(true)
    })

    it('should not affect current story/chapter when marking complete', () => {
      setCurrentChapter('current-story', 'current-chapter')
      markChapterComplete('other-story', 'other-chapter')

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('current-story')
      expect(progress.currentChapter).toBe('current-chapter')
      expect(progress.completedChapters.has('other-story-other-chapter')).toBe(true)
    })

    it('should handle empty string IDs', () => {
      markChapterComplete('', '')

      const progress = progressStore.get()
      expect(progress.completedChapters.has('-')).toBe(true)
    })

    it('should handle special characters in IDs', () => {
      const storyId = 'story-with-éàç-123'
      const chapterId = 'chapter-with-special-chars-456'

      markChapterComplete(storyId, chapterId)

      const progress = progressStore.get()
      expect(progress.completedChapters.has(`${storyId}-${chapterId}`)).toBe(true)
    })

    it('should create new Set instance to maintain immutability', () => {
      const initialProgress = progressStore.get()
      const initialSet = initialProgress.completedChapters

      markChapterComplete('story-1', 'chapter-1')

      const updatedProgress = progressStore.get()
      const updatedSet = updatedProgress.completedChapters

      expect(updatedSet).not.toBe(initialSet) // Different Set instances
      expect(initialSet.size).toBe(0) // Original Set unchanged
      expect(updatedSet.size).toBe(1) // New Set has the addition
    })

    it('should notify subscribers when chapters are marked complete', () => {
      let notificationCount = 0
      const unsubscribe = progressStore.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      markChapterComplete('story-1', 'chapter-1')
      expect(notificationCount).toBe(1)

      markChapterComplete('story-1', 'chapter-2')
      expect(notificationCount).toBe(2)

      unsubscribe()
    })
  })

  describe('setCurrentChapter', () => {
    it('should set current story and chapter', () => {
      setCurrentChapter('story-1', 'chapter-1')

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('story-1')
      expect(progress.currentChapter).toBe('chapter-1')
    })

    it('should update current story and chapter when called multiple times', () => {
      setCurrentChapter('story-1', 'chapter-1')
      setCurrentChapter('story-2', 'chapter-2')

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('story-2')
      expect(progress.currentChapter).toBe('chapter-2')
    })

    it('should not affect completed chapters when setting current', () => {
      markChapterComplete('story-1', 'chapter-1')
      setCurrentChapter('story-2', 'chapter-2')

      const progress = progressStore.get()
      expect(progress.completedChapters.has('story-1-chapter-1')).toBe(true)
      expect(progress.currentStory).toBe('story-2')
      expect(progress.currentChapter).toBe('chapter-2')
    })

    it('should handle empty string IDs', () => {
      setCurrentChapter('', '')

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('')
      expect(progress.currentChapter).toBe('')
    })

    it('should handle null values by setting them as strings', () => {
      // TypeScript prevents null, but testing runtime behavior
      setCurrentChapter('story-1', 'chapter-1')

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('story-1')
      expect(progress.currentChapter).toBe('chapter-1')
    })

    it('should handle special characters in IDs', () => {
      const storyId = 'story-éàç-123'
      const chapterId = 'chapter-special-456'

      setCurrentChapter(storyId, chapterId)

      const progress = progressStore.get()
      expect(progress.currentStory).toBe(storyId)
      expect(progress.currentChapter).toBe(chapterId)
    })

    it('should notify subscribers when current chapter changes', () => {
      let notificationCount = 0
      const unsubscribe = progressStore.subscribe(() => {
        notificationCount++
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      setCurrentChapter('story-1', 'chapter-1')
      expect(notificationCount).toBe(2) // Two setKey calls = two notifications

      unsubscribe()
    })

    it('should handle rapid successive updates', () => {
      setCurrentChapter('story-1', 'chapter-1')
      setCurrentChapter('story-2', 'chapter-2')
      setCurrentChapter('story-3', 'chapter-3')

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('story-3')
      expect(progress.currentChapter).toBe('chapter-3')
    })
  })

  describe('isChapterComplete', () => {
    it('should return false for non-completed chapter', () => {
      const isComplete = isChapterComplete('story-1', 'chapter-1')
      expect(isComplete).toBe(false)
    })

    it('should return true for completed chapter', () => {
      markChapterComplete('story-1', 'chapter-1')

      const isComplete = isChapterComplete('story-1', 'chapter-1')
      expect(isComplete).toBe(true)
    })

    it('should return false for partially matching IDs', () => {
      markChapterComplete('story-1', 'chapter-1')

      expect(isChapterComplete('story-1', 'chapter-2')).toBe(false)
      expect(isChapterComplete('story-2', 'chapter-1')).toBe(false)
      expect(isChapterComplete('story', 'chapter-1')).toBe(false)
    })

    it('should handle multiple completed chapters correctly', () => {
      markChapterComplete('story-1', 'chapter-1')
      markChapterComplete('story-1', 'chapter-2')
      markChapterComplete('story-2', 'chapter-1')

      expect(isChapterComplete('story-1', 'chapter-1')).toBe(true)
      expect(isChapterComplete('story-1', 'chapter-2')).toBe(true)
      expect(isChapterComplete('story-2', 'chapter-1')).toBe(true)
      expect(isChapterComplete('story-2', 'chapter-2')).toBe(false)
    })

    it('should handle empty string IDs', () => {
      markChapterComplete('', '')

      expect(isChapterComplete('', '')).toBe(true)
      expect(isChapterComplete('story', '')).toBe(false)
      expect(isChapterComplete('', 'chapter')).toBe(false)
    })

    it('should handle special characters in IDs', () => {
      const storyId = 'story-éàç-123'
      const chapterId = 'chapter-special-456'

      markChapterComplete(storyId, chapterId)

      expect(isChapterComplete(storyId, chapterId)).toBe(true)
      expect(isChapterComplete('different-story', chapterId)).toBe(false)
    })

    it('should be case sensitive', () => {
      markChapterComplete('Story-1', 'Chapter-1')

      expect(isChapterComplete('Story-1', 'Chapter-1')).toBe(true)
      expect(isChapterComplete('story-1', 'chapter-1')).toBe(false)
      expect(isChapterComplete('STORY-1', 'CHAPTER-1')).toBe(false)
    })

    it('should return boolean type consistently', () => {
      const result1 = isChapterComplete('story-1', 'chapter-1')
      const result2 = isChapterComplete('story-1', 'chapter-1')

      expect(typeof result1).toBe('boolean')
      expect(typeof result2).toBe('boolean')
      expect(result1).toBe(false)
      expect(result2).toBe(false)

      markChapterComplete('story-1', 'chapter-1')

      const result3 = isChapterComplete('story-1', 'chapter-1')
      expect(typeof result3).toBe('boolean')
      expect(result3).toBe(true)
    })
  })

  describe('store reactivity and subscriptions', () => {
    it('should notify subscribers when completedChapters changes', () => {
      let notificationCount = 0
      let lastProgress: Progress | null = null

      const unsubscribe = progressStore.subscribe((progress: Progress) => {
        notificationCount++
        lastProgress = progress
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      markChapterComplete('story-1', 'chapter-1')

      expect(notificationCount).toBe(1)
      expect(lastProgress?.completedChapters.has('story-1-chapter-1')).toBe(true)

      unsubscribe()
    })

    it('should notify subscribers when current story/chapter changes', () => {
      let notificationCount = 0
      let lastProgress: Progress | null = null

      const unsubscribe = progressStore.subscribe((progress: Progress) => {
        notificationCount++
        lastProgress = progress
      })

      // Reset counter after initial subscription notification
      notificationCount = 0

      setCurrentChapter('story-1', 'chapter-1')

      expect(notificationCount).toBe(2) // Two setKey operations
      expect(lastProgress?.currentStory).toBe('story-1')
      expect(lastProgress?.currentChapter).toBe('chapter-1')

      unsubscribe()
    })

    it('should handle multiple subscribers', () => {
      let count1 = 0,
        count2 = 0

      const unsubscribe1 = progressStore.subscribe(() => count1++)
      const unsubscribe2 = progressStore.subscribe(() => count2++)

      // Reset counters after initial subscription notifications
      count1 = 0
      count2 = 0

      markChapterComplete('story-1', 'chapter-1')

      expect(count1).toBe(1)
      expect(count2).toBe(1)

      unsubscribe1()
      unsubscribe2()
    })
  })

  describe('edge cases and complex scenarios', () => {
    it('should handle rapid mixed operations', () => {
      setCurrentChapter('story-1', 'chapter-1')
      markChapterComplete('story-1', 'chapter-1')
      setCurrentChapter('story-1', 'chapter-2')
      markChapterComplete('story-2', 'chapter-1')
      setCurrentChapter('story-2', 'chapter-2')

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('story-2')
      expect(progress.currentChapter).toBe('chapter-2')
      expect(progress.completedChapters.has('story-1-chapter-1')).toBe(true)
      expect(progress.completedChapters.has('story-2-chapter-1')).toBe(true)
      expect(progress.completedChapters.size).toBe(2)
    })

    it('should maintain data integrity across complex workflows', () => {
      // Simulate a complete story progression
      setCurrentChapter('intro-story', 'chapter-1')
      markChapterComplete('intro-story', 'chapter-1')

      setCurrentChapter('intro-story', 'chapter-2')
      markChapterComplete('intro-story', 'chapter-2')

      setCurrentChapter('advanced-story', 'chapter-1')
      markChapterComplete('advanced-story', 'chapter-1')

      const progress = progressStore.get()

      // Verify final state
      expect(progress.currentStory).toBe('advanced-story')
      expect(progress.currentChapter).toBe('chapter-1')
      expect(progress.completedChapters.size).toBe(3)

      // Verify all chapters are marked complete
      expect(isChapterComplete('intro-story', 'chapter-1')).toBe(true)
      expect(isChapterComplete('intro-story', 'chapter-2')).toBe(true)
      expect(isChapterComplete('advanced-story', 'chapter-1')).toBe(true)

      // Verify non-completed chapters
      expect(isChapterComplete('advanced-story', 'chapter-2')).toBe(false)
    })

    it('should handle large numbers of completed chapters', () => {
      // Simulate completing many chapters
      for (let storyNum = 1; storyNum <= 10; storyNum++) {
        for (let chapterNum = 1; chapterNum <= 5; chapterNum++) {
          markChapterComplete(`story-${storyNum}`, `chapter-${chapterNum}`)
        }
      }

      const progress = progressStore.get()
      expect(progress.completedChapters.size).toBe(50)

      // Verify random samples
      expect(isChapterComplete('story-1', 'chapter-1')).toBe(true)
      expect(isChapterComplete('story-5', 'chapter-3')).toBe(true)
      expect(isChapterComplete('story-10', 'chapter-5')).toBe(true)
      expect(isChapterComplete('story-11', 'chapter-1')).toBe(false)
    })

    it('should maintain Set properties and behavior', () => {
      markChapterComplete('story-1', 'chapter-1')
      markChapterComplete('story-1', 'chapter-1') // Duplicate
      markChapterComplete('story-1', 'chapter-2')

      const progress = progressStore.get()
      const completedSet = progress.completedChapters

      expect(completedSet).toBeInstanceOf(Set)
      expect(completedSet.size).toBe(2) // Set prevents duplicates
      expect([...completedSet]).toEqual(['story-1-chapter-1', 'story-1-chapter-2'])
    })

    it('should handle concurrent operations safely', () => {
      // Simulate concurrent operations that might happen in real usage
      const operations = [
        () => setCurrentChapter('story-1', 'chapter-1'),
        () => markChapterComplete('story-1', 'chapter-1'),
        () => setCurrentChapter('story-2', 'chapter-1'),
        () => markChapterComplete('story-2', 'chapter-1'),
        () => isChapterComplete('story-1', 'chapter-1'),
        () => isChapterComplete('story-2', 'chapter-1')
      ]

      // Execute all operations
      operations.forEach(op => op())

      const progress = progressStore.get()
      expect(progress.currentStory).toBe('story-2')
      expect(progress.currentChapter).toBe('chapter-1')
      expect(progress.completedChapters.size).toBe(2)
      expect(isChapterComplete('story-1', 'chapter-1')).toBe(true)
      expect(isChapterComplete('story-2', 'chapter-1')).toBe(true)
    })
  })
})
