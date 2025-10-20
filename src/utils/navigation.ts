import { StoryIndex } from '~/types/story'

/**
 * Loads the story index configuration from the stories directory.
 *
 * This function dynamically imports the index.json file that contains the complete
 * story structure, including all stories, chapters, and navigation relationships.
 * The index file defines the learning path and chapter progression.
 *
 * @returns Promise that resolves to an array of story index objects, or empty array on error
 *
 * @example
 * ```typescript
 * const stories = await loadStoryIndex();
 * // Returns: [{ id: "01-introduction", title: "Introduction aux échecs", chapters: [...] }]
 * ```
 *
 * @note Logs errors to console but returns empty array instead of throwing exceptions
 */
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

/**
 * Calculates the next chapter in the learning progression.
 *
 * This function determines the next chapter a user should navigate to based on their
 * current position. It first tries to find the next chapter within the same story,
 * and if at the end of a story, moves to the first chapter of the next story.
 *
 * @param storyIndex - Array of all story configurations with chapter information
 * @param currentStoryId - ID of the current story the user is in
 * @param currentChapterId - ID of the current chapter the user is viewing
 * @returns Object with next story and chapter IDs, or null if at the end of all content
 *
 * @example
 * ```typescript
 * const next = getNextChapter(stories, "01-introduction", "02-the-chessboard");
 * // Returns: { storyId: "01-introduction", chapterId: "03-the-pieces-overview" }
 *
 * const lastChapter = getNextChapter(stories, "01-introduction", "03-the-pieces-overview");
 * // Returns: { storyId: "02-piece-moves", chapterId: "01-pawn" }
 * ```
 */
export const getNextChapter = (
  storyIndex: StoryIndex[],
  currentStoryId: string,
  currentChapterId: string
): { storyId: string; chapterId: string } | null => {
  const currentStory = storyIndex.find(story => story.id === currentStoryId)
  if (!currentStory) {
    return null
  }

  const currentChapterIndex = currentStory.chapters.findIndex(
    chapter => chapter.id === currentChapterId
  )

  // Next chapter in same story
  if (currentChapterIndex < currentStory.chapters.length - 1) {
    return {
      storyId: currentStoryId,
      chapterId: currentStory.chapters[currentChapterIndex + 1].id
    }
  }

  // First chapter of next story
  const nextStory = currentStory.nextStory
    ? storyIndex.find(story => story.id === currentStory.nextStory)
    : null

  if (!nextStory || nextStory.chapters.length === 0) {
    return null
  }

  return {
    storyId: nextStory.id,
    chapterId: nextStory.chapters[0].id
  }
}

/**
 * Calculates the previous chapter in the learning progression.
 *
 * This function determines the previous chapter a user can navigate back to based on
 * their current position. It first tries to find the previous chapter within the same
 * story, and if at the beginning of a story, moves to the last chapter of the previous story.
 *
 * @param storyIndex - Array of all story configurations with chapter information
 * @param currentStoryId - ID of the current story the user is in
 * @param currentChapterId - ID of the current chapter the user is viewing
 * @returns Object with previous story and chapter IDs, or null if at the beginning of all content
 *
 * @example
 * ```typescript
 * const prev = getPreviousChapter(stories, "01-introduction", "03-the-pieces-overview");
 * // Returns: { storyId: "01-introduction", chapterId: "02-the-chessboard" }
 *
 * const firstOfStory = getPreviousChapter(stories, "02-piece-moves", "01-pawn");
 * // Returns: { storyId: "01-introduction", chapterId: "03-the-pieces-overview" }
 * ```
 */
export const getPreviousChapter = (
  storyIndex: StoryIndex[],
  currentStoryId: string,
  currentChapterId: string
): { storyId: string; chapterId: string } | null => {
  const currentStory = storyIndex.find(story => story.id === currentStoryId)
  if (!currentStory) {
    return null
  }

  const currentChapterIndex = currentStory.chapters.findIndex(
    chapter => chapter.id === currentChapterId
  )

  // Previous chapter in same story
  if (currentChapterIndex > 0) {
    return {
      storyId: currentStoryId,
      chapterId: currentStory.chapters[currentChapterIndex - 1].id
    }
  }

  // Last chapter of previous story
  if (!currentStory.previousStory) {
    return null
  }

  const previousStory = storyIndex.find(story => story.id === currentStory.previousStory)

  if (!previousStory || previousStory.chapters.length === 0) {
    return null
  }

  return {
    storyId: previousStory.id,
    chapterId: previousStory.chapters[previousStory.chapters.length - 1].id
  }
}
