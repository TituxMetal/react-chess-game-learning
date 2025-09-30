import { marked } from 'marked'
import matter from 'gray-matter'

export const parseMarkdown = (content: string) => {
  const { data, content: markdownContent } = matter(content)
  const htmlContent = marked(markdownContent)
  return { frontmatter: data, html: htmlContent }
}