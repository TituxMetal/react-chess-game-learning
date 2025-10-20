import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkStringify from 'remark-stringify'
import { matter } from 'vfile-matter'
import type { VFile } from 'vfile'
import type { Story, StoryFrontmatter, ChapterData } from '~/types/story'

/**
 * Extracts chapter contents from markdown body by splitting on ## headers
 */
const extractChapterContents = (bodyContent: string): string[] => {
  // Split by ## headers (but not ### or higher)
  const sections = bodyContent.split(/^## /m).filter(s => s.trim())

  // If only one section and it doesn't start with ##, no headers were found
  if (sections.length === 1 && !bodyContent.trim().startsWith('##')) {
    return [bodyContent.trim()]
  }

  // If no sections, return empty array (though this shouldn't happen)
  if (sections.length === 0) {
    return [bodyContent.trim()]
  }

  return sections.map(section => '## ' + section.trim())
}

/**
 * Extracts title from chapter content markdown
 */
const extractTitleFromContent = (content: string, fallbackIndex: number): string => {
  // Try to find first ## header
  const match = content.match(/^##\s+(.+)$/m)
  if (match) {
    return match[1].trim()
  }

  // Fallback to generic title
  return `Chapter ${fallbackIndex + 1}`
}

/**
 * Parses a Markdown story file with YAML frontmatter
 * @param rawContent - Raw markdown content as string
 * @returns Parsed Story object with typed chapters
 */
export const parseStoryMarkdown = async (rawContent: string): Promise<Story> => {
  // Create unified processor with frontmatter support
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkGfm)
    .use(remarkStringify)
    .use(() => (_tree, file) => {
      matter(file as VFile)
    })

  // Process the markdown content
  const file = await processor.process(rawContent)

  // Extract frontmatter data
  const frontmatter = (file.data.matter as StoryFrontmatter) || {}

  // Validate required frontmatter fields
  if (!frontmatter.id || !frontmatter.title || !frontmatter.chapters) {
    throw new Error('Story frontmatter must include id, title, and chapters')
  }

  // Extract the body content (after frontmatter)
  // Remove frontmatter markers from output
  let bodyContent = String(file)

  // Remove YAML frontmatter block (including --- markers)
  bodyContent = bodyContent.replace(/^---\n[\s\S]*?\n---\n*/m, '').trim()

  // Split content by ## headers to map to chapters
  const chapterContents = extractChapterContents(bodyContent)

  // Map frontmatter chapters to ChapterData with content
  const chapters: ChapterData[] = frontmatter.chapters.map((chapterMeta, index) => {
    const content = chapterContents[index] || ''

    // Handle chess position: support FEN strings and 'startpos' keyword
    let chessPosition = chapterMeta.chessPosition
    if (chessPosition === 'startpos') {
      chessPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    }

    return {
      id: chapterMeta.id,
      title: chapterMeta.title || extractTitleFromContent(content, index),
      chapterNumber: index + 1,
      storyId: frontmatter.id,
      content,
      image: chapterMeta.image,
      chessPosition,
      question: chapterMeta.question
    }
  })

  // Return fully typed Story object
  return {
    id: frontmatter.id,
    title: frontmatter.title,
    chapters,
    previousStory: frontmatter.previousStory,
    nextStory: frontmatter.nextStory
  }
}

/**
 * Reads a markdown file and parses it into a Story object
 * @param filePath - Path to the markdown file
 * @returns Parsed Story object
 */
export const loadStoryFromFile = async (filePath: string): Promise<Story> => {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Failed to load story file: ${filePath}`)
    }
    const rawContent = await response.text()
    return parseStoryMarkdown(rawContent)
  } catch (error) {
    throw new Error(`Error loading story from ${filePath}: ${error}`)
  }
}
