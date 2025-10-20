import { useStore } from '@nanostores/react'
import { progressStore, markChapterComplete, setCurrentChapter, isChapterComplete } from '~/stores/progressStore'

export const useProgress = () => {
  const progress = useStore(progressStore)

  return {
    progress,
    markComplete: markChapterComplete,
    setCurrent: setCurrentChapter,
    isComplete: isChapterComplete,
  }
}