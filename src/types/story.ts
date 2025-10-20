export interface Question {
  type: 'multiple-choice' | 'move-selection' | 'move-based'
  prompt: string
  options?: string[]
  correctAnswer: string | string[] // Support multiple valid answers
  explanation: string
  initialPosition?: string // FEN for chess positions
}

export interface ChapterData {
  id: string
  title: string
  chapterNumber: number
  storyId: string
  content: string
  question?: Question
  chessPosition?: string
  image?: string
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
  keyConcepts?: string[]
}

// Frontmatter schema interfaces
export interface QuestionMetadata {
  type: 'multiple-choice' | 'move-selection' | 'move-based'
  prompt: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  initialPosition?: string
}

export interface ChapterMetadata {
  id: string
  title?: string
  image?: string
  chessPosition?: string
  question?: QuestionMetadata
}

export interface StoryFrontmatter {
  id: string
  title: string
  chapters: ChapterMetadata[]
  previousStory?: string
  nextStory?: string
  keyConcepts?: string[]
}

// Full Story interface with parsed content
export interface Story {
  id: string
  title: string
  chapters: ChapterData[]
  previousStory?: string
  nextStory?: string
  keyConcepts?: string[]
}