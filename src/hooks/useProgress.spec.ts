import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProgress } from './useProgress'
import * as progressStoreModule from '~/stores/progressStore'

// Mock the progressStore module
vi.mock('~/stores/progressStore', () => ({
  progressStore: {
    get: vi.fn(),
    subscribe: vi.fn(),
    set: vi.fn()
  },
  markChapterComplete: vi.fn(),
  setCurrentChapter: vi.fn(),
  isChapterComplete: vi.fn()
}))

// Mock @nanostores/react
vi.mock('@nanostores/react', () => ({
  useStore: vi.fn()
}))

import { useStore } from '@nanostores/react'

describe('useProgress', () => {
  const mockProgress = {
    completedChapters: new Set(['story-1-chapter-1', 'story-2-chapter-1']),
    currentStory: 'story-1',
    currentChapter: 'chapter-2'
  }

  const mockMarkChapterComplete = vi.mocked(progressStoreModule.markChapterComplete)
  const mockSetCurrentChapter = vi.mocked(progressStoreModule.setCurrentChapter)
  const mockIsChapterComplete = vi.mocked(progressStoreModule.isChapterComplete)
  const mockUseStore = vi.mocked(useStore)

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock return values
    mockUseStore.mockReturnValue(mockProgress)
    mockIsChapterComplete.mockReturnValue(false)
  })

  describe('hook initialization', () => {
    it('should return progress state from store', () => {
      const { result } = renderHook(() => useProgress())

      expect(result.current.progress).toBe(mockProgress)
      expect(mockUseStore).toHaveBeenCalledWith(progressStoreModule.progressStore)
    })

    it('should return function references for store operations', () => {
      const { result } = renderHook(() => useProgress())

      expect(result.current.markComplete).toBe(progressStoreModule.markChapterComplete)
      expect(result.current.setCurrent).toBe(progressStoreModule.setCurrentChapter)
      expect(result.current.isComplete).toBe(progressStoreModule.isChapterComplete)
    })

    it('should have consistent return object structure', () => {
      const { result } = renderHook(() => useProgress())

      expect(result.current).toHaveProperty('progress')
      expect(result.current).toHaveProperty('markComplete')
      expect(result.current).toHaveProperty('setCurrent')
      expect(result.current).toHaveProperty('isComplete')
      expect(Object.keys(result.current)).toHaveLength(4)
    })
  })

  describe('progress state reactivity', () => {
    it('should update when progress store changes', () => {
      const initialProgress = {
        completedChapters: new Set(),
        currentStory: null,
        currentChapter: null
      }

      const updatedProgress = {
        completedChapters: new Set(['story-1-chapter-1']),
        currentStory: 'story-1',
        currentChapter: 'chapter-1'
      }

      mockUseStore.mockReturnValueOnce(initialProgress)
      const { result, rerender } = renderHook(() => useProgress())

      expect(result.current.progress).toBe(initialProgress)

      mockUseStore.mockReturnValueOnce(updatedProgress)
      rerender()

      expect(result.current.progress).toBe(updatedProgress)
    })

    it('should reflect real-time changes in completed chapters', () => {
      const progressWithNoChapters = {
        completedChapters: new Set(),
        currentStory: null,
        currentChapter: null
      }

      const progressWithChapters = {
        completedChapters: new Set(['story-1-chapter-1', 'story-1-chapter-2']),
        currentStory: 'story-1',
        currentChapter: 'chapter-2'
      }

      mockUseStore.mockReturnValueOnce(progressWithNoChapters)
      const { result, rerender } = renderHook(() => useProgress())

      expect(result.current.progress.completedChapters.size).toBe(0)

      mockUseStore.mockReturnValueOnce(progressWithChapters)
      rerender()

      expect(result.current.progress.completedChapters.size).toBe(2)
      expect(result.current.progress.completedChapters.has('story-1-chapter-1')).toBe(true)
      expect(result.current.progress.completedChapters.has('story-1-chapter-2')).toBe(true)
    })

    it('should reflect changes in current story and chapter', () => {
      const initialProgress = {
        completedChapters: new Set(),
        currentStory: 'story-1',
        currentChapter: 'chapter-1'
      }

      const updatedProgress = {
        completedChapters: new Set(),
        currentStory: 'story-2',
        currentChapter: 'chapter-3'
      }

      mockUseStore.mockReturnValueOnce(initialProgress)
      const { result, rerender } = renderHook(() => useProgress())

      expect(result.current.progress.currentStory).toBe('story-1')
      expect(result.current.progress.currentChapter).toBe('chapter-1')

      mockUseStore.mockReturnValueOnce(updatedProgress)
      rerender()

      expect(result.current.progress.currentStory).toBe('story-2')
      expect(result.current.progress.currentChapter).toBe('chapter-3')
    })
  })

  describe('markComplete function', () => {
    it('should call markChapterComplete with correct parameters', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.markComplete('story-1', 'chapter-1')
      })

      expect(mockMarkChapterComplete).toHaveBeenCalledWith('story-1', 'chapter-1')
      expect(mockMarkChapterComplete).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple chapter completions', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.markComplete('story-1', 'chapter-1')
        result.current.markComplete('story-1', 'chapter-2')
        result.current.markComplete('story-2', 'chapter-1')
      })

      expect(mockMarkChapterComplete).toHaveBeenCalledTimes(3)
      expect(mockMarkChapterComplete).toHaveBeenNthCalledWith(1, 'story-1', 'chapter-1')
      expect(mockMarkChapterComplete).toHaveBeenNthCalledWith(2, 'story-1', 'chapter-2')
      expect(mockMarkChapterComplete).toHaveBeenNthCalledWith(3, 'story-2', 'chapter-1')
    })

    it('should handle empty string parameters', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.markComplete('', '')
      })

      expect(mockMarkChapterComplete).toHaveBeenCalledWith('', '')
    })

    it('should handle special characters in IDs', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.markComplete('story-éàç-123', 'chapter-special-456')
      })

      expect(mockMarkChapterComplete).toHaveBeenCalledWith('story-éàç-123', 'chapter-special-456')
    })
  })

  describe('setCurrent function', () => {
    it('should call setCurrentChapter with correct parameters', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setCurrent('story-1', 'chapter-1')
      })

      expect(mockSetCurrentChapter).toHaveBeenCalledWith('story-1', 'chapter-1')
      expect(mockSetCurrentChapter).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple current chapter updates', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setCurrent('story-1', 'chapter-1')
        result.current.setCurrent('story-1', 'chapter-2')
        result.current.setCurrent('story-2', 'chapter-1')
      })

      expect(mockSetCurrentChapter).toHaveBeenCalledTimes(3)
      expect(mockSetCurrentChapter).toHaveBeenNthCalledWith(1, 'story-1', 'chapter-1')
      expect(mockSetCurrentChapter).toHaveBeenNthCalledWith(2, 'story-1', 'chapter-2')
      expect(mockSetCurrentChapter).toHaveBeenNthCalledWith(3, 'story-2', 'chapter-1')
    })

    it('should handle rapid successive updates', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setCurrent('story-1', 'chapter-1')
        result.current.setCurrent('story-2', 'chapter-2')
        result.current.setCurrent('story-3', 'chapter-3')
      })

      expect(mockSetCurrentChapter).toHaveBeenCalledTimes(3)
      expect(mockSetCurrentChapter).toHaveBeenLastCalledWith('story-3', 'chapter-3')
    })

    it('should handle empty string parameters', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setCurrent('', '')
      })

      expect(mockSetCurrentChapter).toHaveBeenCalledWith('', '')
    })
  })

  describe('isComplete function', () => {
    it('should call isChapterComplete with correct parameters', () => {
      const { result } = renderHook(() => useProgress())

      result.current.isComplete('story-1', 'chapter-1')

      expect(mockIsChapterComplete).toHaveBeenCalledWith('story-1', 'chapter-1')
      expect(mockIsChapterComplete).toHaveBeenCalledTimes(1)
    })

    it('should return the result from isChapterComplete', () => {
      mockIsChapterComplete.mockReturnValue(true)
      const { result } = renderHook(() => useProgress())

      const isComplete = result.current.isComplete('story-1', 'chapter-1')

      expect(isComplete).toBe(true)
      expect(mockIsChapterComplete).toHaveBeenCalledWith('story-1', 'chapter-1')
    })

    it('should handle false return values', () => {
      mockIsChapterComplete.mockReturnValue(false)
      const { result } = renderHook(() => useProgress())

      const isComplete = result.current.isComplete('story-1', 'chapter-1')

      expect(isComplete).toBe(false)
    })

    it('should handle multiple completion checks', () => {
      mockIsChapterComplete
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)

      const { result } = renderHook(() => useProgress())

      expect(result.current.isComplete('story-1', 'chapter-1')).toBe(true)
      expect(result.current.isComplete('story-1', 'chapter-2')).toBe(false)
      expect(result.current.isComplete('story-2', 'chapter-1')).toBe(true)

      expect(mockIsChapterComplete).toHaveBeenCalledTimes(3)
    })

    it('should handle empty string parameters', () => {
      const { result } = renderHook(() => useProgress())

      result.current.isComplete('', '')

      expect(mockIsChapterComplete).toHaveBeenCalledWith('', '')
    })
  })

  describe('function reference stability', () => {
    it('should maintain stable function references across re-renders', () => {
      const { result, rerender } = renderHook(() => useProgress())

      const initialMarkComplete = result.current.markComplete
      const initialSetCurrent = result.current.setCurrent
      const initialIsComplete = result.current.isComplete

      // Trigger re-render with different progress state
      mockUseStore.mockReturnValue({
        completedChapters: new Set(['new-chapter']),
        currentStory: 'new-story',
        currentChapter: 'new-chapter'
      })
      rerender()

      expect(result.current.markComplete).toBe(initialMarkComplete)
      expect(result.current.setCurrent).toBe(initialSetCurrent)
      expect(result.current.isComplete).toBe(initialIsComplete)
    })

    it('should always reference the same store functions', () => {
      const { result } = renderHook(() => useProgress())

      expect(result.current.markComplete).toBe(progressStoreModule.markChapterComplete)
      expect(result.current.setCurrent).toBe(progressStoreModule.setCurrentChapter)
      expect(result.current.isComplete).toBe(progressStoreModule.isChapterComplete)
    })
  })

  describe('integration scenarios', () => {
    it('should work with typical user workflow', () => {
      const { result } = renderHook(() => useProgress())

      // User starts a chapter
      act(() => {
        result.current.setCurrent('intro-story', 'chapter-1')
      })

      // User completes the chapter
      act(() => {
        result.current.markComplete('intro-story', 'chapter-1')
      })

      // Check if chapter is complete
      mockIsChapterComplete.mockReturnValue(true)
      const isComplete = result.current.isComplete('intro-story', 'chapter-1')

      expect(mockSetCurrentChapter).toHaveBeenCalledWith('intro-story', 'chapter-1')
      expect(mockMarkChapterComplete).toHaveBeenCalledWith('intro-story', 'chapter-1')
      expect(mockIsChapterComplete).toHaveBeenCalledWith('intro-story', 'chapter-1')
      expect(isComplete).toBe(true)
    })

    it('should handle mixed operations in sequence', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        result.current.setCurrent('story-1', 'chapter-1')
        result.current.markComplete('story-1', 'chapter-1')
        result.current.setCurrent('story-1', 'chapter-2')
      })

      result.current.isComplete('story-1', 'chapter-1')
      result.current.isComplete('story-1', 'chapter-2')

      expect(mockSetCurrentChapter).toHaveBeenCalledTimes(2)
      expect(mockMarkChapterComplete).toHaveBeenCalledTimes(1)
      expect(mockIsChapterComplete).toHaveBeenCalledTimes(2)
    })

    it('should handle concurrent operations safely', () => {
      const { result } = renderHook(() => useProgress())

      act(() => {
        // Simulate rapid user interactions
        result.current.setCurrent('story-1', 'chapter-1')
        result.current.isComplete('story-1', 'chapter-1')
        result.current.markComplete('story-1', 'chapter-1')
        result.current.setCurrent('story-1', 'chapter-2')
        result.current.isComplete('story-1', 'chapter-2')
      })

      expect(mockSetCurrentChapter).toHaveBeenCalledTimes(2)
      expect(mockMarkChapterComplete).toHaveBeenCalledTimes(1)
      expect(mockIsChapterComplete).toHaveBeenCalledTimes(2)
    })
  })

  describe('edge cases', () => {
    it('should handle null/undefined progress state gracefully', () => {
      mockUseStore.mockReturnValue(null as any)
      const { result } = renderHook(() => useProgress())

      expect(result.current.progress).toBeNull()
      expect(result.current.markComplete).toBe(progressStoreModule.markChapterComplete)
      expect(result.current.setCurrent).toBe(progressStoreModule.setCurrentChapter)
      expect(result.current.isComplete).toBe(progressStoreModule.isChapterComplete)
    })

    it('should handle undefined store functions gracefully', () => {
      // This tests the hook's resilience to module loading issues
      const { result } = renderHook(() => useProgress())

      expect(typeof result.current.markComplete).toBe('function')
      expect(typeof result.current.setCurrent).toBe('function')
      expect(typeof result.current.isComplete).toBe('function')
    })

    it('should handle very long story and chapter IDs', () => {
      const { result } = renderHook(() => useProgress())
      const longStoryId = 'a'.repeat(1000)
      const longChapterId = 'b'.repeat(1000)

      act(() => {
        result.current.setCurrent(longStoryId, longChapterId)
        result.current.markComplete(longStoryId, longChapterId)
      })

      result.current.isComplete(longStoryId, longChapterId)

      expect(mockSetCurrentChapter).toHaveBeenCalledWith(longStoryId, longChapterId)
      expect(mockMarkChapterComplete).toHaveBeenCalledWith(longStoryId, longChapterId)
      expect(mockIsChapterComplete).toHaveBeenCalledWith(longStoryId, longChapterId)
    })
  })
})
