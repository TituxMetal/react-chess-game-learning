import { useEffect, useState } from 'react'
import { resetQuestionState } from '~/lib/stores/questionStore'
import { StoryIndex } from '~/types/story'

interface UseChapterProgressProps {
  storyId: string
  chapterId: string
  storyIndex: StoryIndex[]
  setCurrent: (storyId: string, chapterId: string) => void
}

export const useChapterProgress = ({
  storyId,
  chapterId,
  storyIndex,
  setCurrent
}: UseChapterProgressProps) => {
  const [showQuestion, setShowQuestion] = useState(false)
  const [questionAnswered, setQuestionAnswered] = useState(false)

  // Set current chapter in progress store
  useEffect(() => {
    if (!storyId || !chapterId) {
      return
    }

    setCurrent(storyId, chapterId)
  }, [storyId, chapterId, setCurrent])

  // Reset state when chapter changes
  useEffect(() => {
    setShowQuestion(true)
    setQuestionAnswered(false)
    // Reset global question state to ensure chess pieces are interactive
    // This fixes the bug where pieces were not interactive after navigation
    // between chapters (they would remain in 'submitted: true' state)
    resetQuestionState()
  }, [storyId, chapterId])

  const handleQuestionAnswer = (_correct: boolean) => {
    setQuestionAnswered(true)
    // Note: marking complete is handled in the parent component
    // since it needs access to markComplete function
  }

  // Calculate progress based on current story
  const currentStory = storyIndex.find(story => story.id === storyId)
  const currentChapterIndex = currentStory?.chapters.findIndex(ch => ch.id === chapterId) ?? 0
  const totalChapters = currentStory?.chapters.length ?? 1
  const currentChapterNumber = currentChapterIndex + 1

  return {
    showQuestion,
    questionAnswered,
    handleQuestionAnswer,
    currentChapterNumber,
    totalChapters
  }
}
