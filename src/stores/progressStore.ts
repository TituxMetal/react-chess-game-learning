import { atom, map } from 'nanostores'

export interface Progress {
  completedChapters: Set<string>
  currentStory: string | null
  currentChapter: string | null
}

export const progressStore = map<Progress>({
  completedChapters: new Set(),
  currentStory: null,
  currentChapter: null,
})

export const markChapterComplete = (storyId: string, chapterId: string) => {
  const current = progressStore.get()
  const newCompleted = new Set(current.completedChapters)
  newCompleted.add(`${storyId}-${chapterId}`)
  
  progressStore.setKey('completedChapters', newCompleted)
}

export const setCurrentChapter = (storyId: string, chapterId: string) => {
  progressStore.setKey('currentStory', storyId)
  progressStore.setKey('currentChapter', chapterId)
}

export const isChapterComplete = (storyId: string, chapterId: string): boolean => {
  const progress = progressStore.get()
  return progress.completedChapters.has(`${storyId}-${chapterId}`)
}