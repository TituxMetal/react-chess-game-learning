import { StoryIndex } from '../types/story'

export const loadStoryIndex = async (): Promise<StoryIndex[]> => {
  try {
    // Dynamic import of the index file from src/stories
    const indexModule = await import('../stories/index.json')
    return indexModule.default
  } catch (error) {
    console.error('Error loading story index:', error)
    return []
  }
}

export const getNextChapter = (
  storyIndex: StoryIndex[],
  currentStoryId: string,
  currentChapterId: string
): { storyId: string; chapterId: string } | null => {
  const currentStory = storyIndex.find(story => story.id === currentStoryId)
  if (!currentStory) return null

  const currentChapterIndex = currentStory.chapters.findIndex(
    chapter => chapter.id === currentChapterId
  )

  // Next chapter in same story
  if (currentChapterIndex < currentStory.chapters.length - 1) {
    return {
      storyId: currentStoryId,
      chapterId: currentStory.chapters[currentChapterIndex + 1].id,
    }
  }

  // First chapter of next story
  if (currentStory.nextStory) {
    const nextStory = storyIndex.find(story => story.id === currentStory.nextStory)
    if (nextStory && nextStory.chapters.length > 0) {
      return {
        storyId: nextStory.id,
        chapterId: nextStory.chapters[0].id,
      }
    }
  }

  return null
}

export const getPreviousChapter = (
  storyIndex: StoryIndex[],
  currentStoryId: string,
  currentChapterId: string
): { storyId: string; chapterId: string } | null => {
  const currentStory = storyIndex.find(story => story.id === currentStoryId)
  if (!currentStory) return null

  const currentChapterIndex = currentStory.chapters.findIndex(
    chapter => chapter.id === currentChapterId
  )

  // Previous chapter in same story
  if (currentChapterIndex > 0) {
    return {
      storyId: currentStoryId,
      chapterId: currentStory.chapters[currentChapterIndex - 1].id,
    }
  }

  // Last chapter of previous story
  if (currentStory.previousStory) {
    const previousStory = storyIndex.find(story => story.id === currentStory.previousStory)
    if (previousStory && previousStory.chapters.length > 0) {
      return {
        storyId: previousStory.id,
        chapterId: previousStory.chapters[previousStory.chapters.length - 1].id,
      }
    }
  }

  return null
}