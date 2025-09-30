import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import { matter } from 'vfile-matter'

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
