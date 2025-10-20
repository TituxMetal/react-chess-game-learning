import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StoryIndex } from '~/types/story'
import { getNextChapter, getPreviousChapter, loadStoryIndex } from '~/utils/navigation'

interface UseStoryNavigationProps {
  storyId: string
  chapterId: string
}

/**
 * Custom hook for managing story and chapter navigation logic.
 *
 * This hook handles the complex navigation flow between chapters and stories,
 * including loading the story index, calculating next/previous chapters,
 * and managing the transition to completion pages. It coordinates with the
 * progress tracking system to ensure chapters are marked complete before navigation.
 *
 * @param props - Navigation configuration object
 * @param props.storyId - Current story ID
 * @param props.chapterId - Current chapter ID
 *
 * @returns Object containing navigation state and control functions
 *
 * @example
 * ```typescript
 * const { storyIndex, nextChapter, previousChapter, handleNext } = useStoryNavigation({
 *   storyId: '01-introduction',
 *   chapterId: '02-the-chessboard'
 * });
 *
 * // Navigate to next chapter
 * handleNext(true, true, markComplete);
 * ```
 */
export const useStoryNavigation = ({ storyId, chapterId }: UseStoryNavigationProps) => {
  const navigate = useNavigate()
  const [storyIndex, setStoryIndex] = useState<StoryIndex[]>([])
  const [nextChapter, setNextChapter] = useState<{ storyId: string; chapterId: string } | null>(
    null
  )
  const [previousChapter, setPreviousChapter] = useState<{
    storyId: string
    chapterId: string
  } | null>(null)

  // Load story index and calculate navigation
  useEffect(() => {
    const loadNavigation = async () => {
      const index = await loadStoryIndex()
      setStoryIndex(index)

      if (!storyId || !chapterId) {
        return
      }

      const next = getNextChapter(index, storyId, chapterId)
      const prev = getPreviousChapter(index, storyId, chapterId)

      setNextChapter(next)
      setPreviousChapter(prev)
    }

    loadNavigation()
  }, [storyId, chapterId])

  const handleNext = useCallback(
    (
      questionAnswered: boolean,
      hasQuestion: boolean,
      markComplete: (storyId: string, chapterId: string) => void
    ) => {
      if (!hasQuestion || questionAnswered) {
        markComplete(storyId, chapterId)
      }

      // Check if this is the last chapter of the current story
      const isLastChapterOfStory = nextChapter?.storyId !== storyId

      if (isLastChapterOfStory || !nextChapter) {
        // Navigate to completion page
        navigate(`/story/${storyId}/completion`)
        return
      }

      // Navigate to next chapter in same story
      navigate(`/story/${nextChapter.storyId}/chapter/${nextChapter.chapterId}`)
    },
    [navigate, nextChapter, storyId, chapterId]
  )

  return {
    storyIndex,
    nextChapter,
    previousChapter,
    handleNext
  }
}
