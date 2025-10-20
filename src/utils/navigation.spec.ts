import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { StoryIndex } from '~/types/story'
import { getNextChapter, getPreviousChapter, loadStoryIndex } from './navigation'

// Mock the dynamic import
vi.mock('../stories/index.json', () => ({
  default: [
    {
      id: '01-introduction',
      title: 'Introduction to Chess',
      chapters: [
        { id: '01-what-is-chess', title: 'What is Chess?' },
        { id: '02-board-setup', title: 'Board Setup' },
        { id: '03-piece-names', title: 'Piece Names' }
      ],
      nextStory: '02-piece-moves',
      previousStory: null
    },
    {
      id: '02-piece-moves',
      title: 'How Pieces Move',
      chapters: [
        { id: '01-pawn-moves', title: 'Pawn Movement' },
        { id: '02-rook-moves', title: 'Rook Movement' }
      ],
      nextStory: '03-basic-rules',
      previousStory: '01-introduction'
    },
    {
      id: '03-basic-rules',
      title: 'Basic Rules',
      chapters: [
        { id: '01-check', title: 'Check' },
        { id: '02-checkmate', title: 'Checkmate' },
        { id: '03-stalemate', title: 'Stalemate' }
      ],
      nextStory: null,
      previousStory: '02-piece-moves'
    }
  ]
}))

describe('navigation utilities', () => {
  let mockStoryIndex: StoryIndex[]

  beforeEach(() => {
    mockStoryIndex = [
      {
        id: '01-introduction',
        title: 'Introduction to Chess',
        chapters: [
          { id: '01-what-is-chess', title: 'What is Chess?' },
          { id: '02-board-setup', title: 'Board Setup' },
          { id: '03-piece-names', title: 'Piece Names' }
        ],
        nextStory: '02-piece-moves',
        previousStory: undefined
      },
      {
        id: '02-piece-moves',
        title: 'How Pieces Move',
        chapters: [
          { id: '01-pawn-moves', title: 'Pawn Movement' },
          { id: '02-rook-moves', title: 'Rook Movement' }
        ],
        nextStory: '03-basic-rules',
        previousStory: '01-introduction'
      },
      {
        id: '03-basic-rules',
        title: 'Basic Rules',
        chapters: [
          { id: '01-check', title: 'Check' },
          { id: '02-checkmate', title: 'Checkmate' },
          { id: '03-stalemate', title: 'Stalemate' }
        ],
        nextStory: undefined,
        previousStory: '02-piece-moves'
      }
    ]
  })

  describe('loadStoryIndex', () => {
    it('should load story index successfully', async () => {
      const result = await loadStoryIndex()

      expect(result).toHaveLength(3)
      expect(result[0].id).toBe('01-introduction')
      expect(result[0].title).toBe('Introduction to Chess')
      expect(result[0].chapters).toHaveLength(3)
    })
  })

  describe('getNextChapter', () => {
    it('should return next chapter in same story', () => {
      const result = getNextChapter(mockStoryIndex, '01-introduction', '01-what-is-chess')

      expect(result).toEqual({
        storyId: '01-introduction',
        chapterId: '02-board-setup'
      })
    })

    it('should return first chapter of next story when at end of current story', () => {
      const result = getNextChapter(mockStoryIndex, '01-introduction', '03-piece-names')

      expect(result).toEqual({
        storyId: '02-piece-moves',
        chapterId: '01-pawn-moves'
      })
    })

    it('should return null when at last chapter of last story', () => {
      const result = getNextChapter(mockStoryIndex, '03-basic-rules', '03-stalemate')

      expect(result).toBeNull()
    })

    it('should return null for non-existent story', () => {
      const result = getNextChapter(mockStoryIndex, 'non-existent', '01-chapter')

      expect(result).toBeNull()
    })

    it('should return first chapter when chapter not found (findIndex returns -1)', () => {
      const result = getNextChapter(mockStoryIndex, '01-introduction', 'non-existent')

      // When findIndex returns -1, -1 < length - 1 is true, so it returns chapters[0]
      expect(result).toEqual({
        storyId: '01-introduction',
        chapterId: '01-what-is-chess'
      })
    })

    it('should handle story with nextStory but next story not found', () => {
      const modifiedIndex = [...mockStoryIndex]
      modifiedIndex[0].nextStory = 'non-existent-story'

      const result = getNextChapter(modifiedIndex, '01-introduction', '03-piece-names')

      expect(result).toBeNull()
    })

    it('should handle next story with no chapters', () => {
      const modifiedIndex = [...mockStoryIndex]
      modifiedIndex[1].chapters = []

      const result = getNextChapter(modifiedIndex, '01-introduction', '03-piece-names')

      expect(result).toBeNull()
    })
  })

  describe('getPreviousChapter', () => {
    it('should return previous chapter in same story', () => {
      const result = getPreviousChapter(mockStoryIndex, '01-introduction', '02-board-setup')

      expect(result).toEqual({
        storyId: '01-introduction',
        chapterId: '01-what-is-chess'
      })
    })

    it('should return last chapter of previous story when at beginning of current story', () => {
      const result = getPreviousChapter(mockStoryIndex, '02-piece-moves', '01-pawn-moves')

      expect(result).toEqual({
        storyId: '01-introduction',
        chapterId: '03-piece-names'
      })
    })

    it('should return null when at first chapter of first story', () => {
      const result = getPreviousChapter(mockStoryIndex, '01-introduction', '01-what-is-chess')

      expect(result).toBeNull()
    })

    it('should return null for non-existent story', () => {
      const result = getPreviousChapter(mockStoryIndex, 'non-existent', '01-chapter')

      expect(result).toBeNull()
    })

    it('should return null for non-existent chapter', () => {
      const result = getPreviousChapter(mockStoryIndex, '01-introduction', 'non-existent')

      expect(result).toBeNull()
    })

    it('should handle story with previousStory but previous story not found', () => {
      const modifiedIndex = [...mockStoryIndex]
      modifiedIndex[1].previousStory = 'non-existent-story'

      const result = getPreviousChapter(modifiedIndex, '02-piece-moves', '01-pawn-moves')

      expect(result).toBeNull()
    })

    it('should handle previous story with no chapters', () => {
      const modifiedIndex = [...mockStoryIndex]
      modifiedIndex[0].chapters = []

      const result = getPreviousChapter(modifiedIndex, '02-piece-moves', '01-pawn-moves')

      expect(result).toBeNull()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty story index', () => {
      const emptyIndex: StoryIndex[] = []

      expect(getNextChapter(emptyIndex, '01-story', '01-chapter')).toBeNull()
      expect(getPreviousChapter(emptyIndex, '01-story', '01-chapter')).toBeNull()
    })

    it('should handle story with single chapter', () => {
      const singleChapterIndex: StoryIndex[] = [
        {
          id: 'single-story',
          title: 'Single Story',
          chapters: [{ id: 'only-chapter', title: 'Only Chapter' }],
          nextStory: undefined,
          previousStory: undefined
        }
      ]

      expect(getNextChapter(singleChapterIndex, 'single-story', 'only-chapter')).toBeNull()
      expect(getPreviousChapter(singleChapterIndex, 'single-story', 'only-chapter')).toBeNull()
    })
  })
})
