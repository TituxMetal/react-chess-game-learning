export interface Question {
  type: 'multiple-choice' | 'move-selection'
  prompt: string
  options?: string[]
  correctAnswer: string
  explanation: string
}

export interface ChapterData {
  id: string
  title: string
  chapterNumber: number
  storyId: string
  content: string
  question?: Question
  chessPosition?: string
}

export interface StoryIndex {
  id: string
  title: string
  chapters: Array<{
    id: string
    title: string
  }>
  previousStory?: string
  nextStory?: string
}