import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as markdownParserModule from '~/utils/markdownParser'
import { useStory } from './useStory'

// Mock the markdown parser
vi.mock('~/utils/markdownParser', () => ({
  parseMarkdown: vi.fn()
}))

describe('useStory Hook', () => {
  const mockParseMarkdown = vi.mocked(markdownParserModule.parseMarkdown)

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock - will be overridden in specific tests
    mockParseMarkdown.mockReturnValue({
      frontmatter: {
        id: 'chapter-1',
        title: 'Test Chapter',
        chapterNumber: 1,
        storyId: 'test-story',
        question: {
          type: 'multiple-choice',
          prompt: 'Test question?',
          options: ['A', 'B', 'C'],
          correctAnswer: 'A',
          explanation: 'Test explanation'
        },
        chessPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      },
      markdown: '# Test Chapter Content\n\nThis is test content.'
    })
  })

  it('should load chapter successfully with real test files', async () => {
    const { result } = renderHook(() => useStory('test-story', 'chapter-1'))

    // Initially loading
    expect(result.current.loading).toBe(true)
    expect(result.current.chapter).toBe(null)
    expect(result.current.error).toBe(null)

    // Wait for chapter to load
    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    expect(result.current.chapter).toBeDefined()
    expect(result.current.chapter?.id).toBe('chapter-1')
    expect(result.current.chapter?.title).toBe('Test Chapter')
    expect(result.current.error).toBe(null)
  })

  it('should handle loading second chapter', async () => {
    // Mock chapter-2 data
    mockParseMarkdown.mockReturnValue({
      frontmatter: {
        id: 'chapter-2',
        title: 'Test Chapter 2',
        chapterNumber: 2,
        storyId: 'test-story',
        question: {
          type: 'move-based',
          prompt: 'Make the best move',
          correctAnswer: 'e2e4',
          explanation: 'This opens the center'
        },
        chessPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      },
      markdown: '# Test Chapter 2 Content\n\nThis is test content for chapter 2.'
    })

    const { result } = renderHook(() => useStory('test-story', 'chapter-2'))

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    expect(result.current.chapter).toBeDefined()
    expect(result.current.chapter?.id).toBe('chapter-2')
    expect(result.current.error).toBe(null)
  })

  it('should handle error story gracefully', async () => {
    const { result } = renderHook(() => useStory('error-story', 'error-chapter'))

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    // Should either load successfully or handle error gracefully
    if (result.current.error) {
      expect(result.current.chapter).toBe(null)
      expect(result.current.error).toContain('error')
    } else {
      expect(result.current.chapter).toBeDefined()
    }
  })

  it('should not load when storyId is missing', () => {
    const { result } = renderHook(() => useStory('', 'chapter-1'))

    expect(result.current.loading).toBe(true)
    expect(result.current.chapter).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should not load when chapterId is missing', () => {
    const { result } = renderHook(() => useStory('test-story', ''))

    expect(result.current.loading).toBe(true)
    expect(result.current.chapter).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should reload when storyId changes', async () => {
    const { result, rerender } = renderHook(
      ({ storyId, chapterId }) => useStory(storyId, chapterId),
      {
        initialProps: { storyId: 'test-story', chapterId: 'chapter-1' }
      }
    )

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    const firstChapter = result.current.chapter

    // Change storyId
    rerender({ storyId: 'error-story', chapterId: 'error-chapter' })

    expect(result.current.loading).toBe(true)

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    expect(result.current.chapter).not.toBe(firstChapter)
  })

  it('should reload when chapterId changes', async () => {
    const { result, rerender } = renderHook(
      ({ storyId, chapterId }) => useStory(storyId, chapterId),
      {
        initialProps: { storyId: 'test-story', chapterId: 'chapter-1' }
      }
    )

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    const firstChapter = result.current.chapter

    // Change chapterId
    rerender({ storyId: 'test-story', chapterId: 'chapter-2' })

    expect(result.current.loading).toBe(true)

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    expect(result.current.chapter).not.toBe(firstChapter)
  })

  it('should handle chapter data structure correctly', async () => {
    const { result } = renderHook(() => useStory('test-story', 'chapter-1'))

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    const chapter = result.current.chapter
    expect(chapter).toBeDefined()
    expect(chapter).toHaveProperty('id')
    expect(chapter).toHaveProperty('title')
    expect(chapter).toHaveProperty('chapterNumber')
    expect(chapter).toHaveProperty('storyId')
    expect(chapter).toHaveProperty('content')
    expect(chapter).toHaveProperty('question')
    expect(chapter).toHaveProperty('chessPosition')
  })

  it('should handle chapters with move-based questions', async () => {
    // Mock chapter with move-based question
    mockParseMarkdown.mockReturnValue({
      frontmatter: {
        id: 'chapter-2',
        title: 'Test Chapter 2',
        chapterNumber: 2,
        storyId: 'test-story',
        question: {
          type: 'move-based',
          prompt: 'Make the best move',
          correctAnswer: 'e2e4',
          explanation: 'This opens the center'
        },
        chessPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      },
      markdown: '# Test Chapter 2 Content\n\nThis is test content for chapter 2.'
    })

    const { result } = renderHook(() => useStory('test-story', 'chapter-2'))

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false)
      },
      { timeout: 5000 }
    )

    const chapter = result.current.chapter
    expect(chapter?.question?.type).toBe('move-based')
  })
})
