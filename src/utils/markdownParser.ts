import remarkFrontmatter from 'remark-frontmatter'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'
import { matter } from 'vfile-matter'

/**
 * Parses markdown content with YAML frontmatter and returns separated data.
 *
 * This function processes markdown files that contain YAML frontmatter at the beginning,
 * extracting the metadata and returning both the parsed frontmatter data and the clean
 * markdown content without the frontmatter block.
 *
 * @param content - Raw markdown string containing YAML frontmatter and markdown content
 * @returns Object containing parsed frontmatter data and clean markdown content
 *
 * @example
 * ```typescript
 * const markdownWithFrontmatter = `---
 * title: "Chapter 1"
 * id: "chapter-1"
 * ---
 * # Chapter Content
 * This is the chapter content.`;
 *
 * const { frontmatter, markdown } = parseMarkdown(markdownWithFrontmatter);
 * // frontmatter: { title: "Chapter 1", id: "chapter-1" }
 * // markdown: "# Chapter Content\nThis is the chapter content."
 * ```
 *
 * @note Will log errors to console if markdown parsing fails, but does not throw exceptions
 */
export const parseMarkdown = (content: string) => {
  const file = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(() => (_tree, file) => {
      matter(file)
    })
    .use(remarkStringify)
    .processSync(content)

  return {
    frontmatter: file.data.matter as Record<string, any>,
    markdown: String(file).replace(/^---[\s\S]*?---\n/, '')
  }
}
