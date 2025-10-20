import { describe, expect, it } from 'vitest'
import { parseMarkdown } from './markdownParser'

describe('parseMarkdown', () => {
  describe('Basic Parsing', () => {
    it('should parse markdown with YAML frontmatter', () => {
      const content = `---
title: Test Chapter
id: test-01
chapterNumber: 1
---

# Test Chapter

This is a test chapter with **bold** text.`

      const result = parseMarkdown(content)

      expect(result.frontmatter).toEqual({
        title: 'Test Chapter',
        id: 'test-01',
        chapterNumber: 1
      })
      expect(result.markdown).toBe(
        '\n# Test Chapter\n\nThis is a test chapter with **bold** text.\n'
      )
    })

    it('should handle markdown without frontmatter', () => {
      const content = `# Simple Chapter

Just some content without frontmatter.`

      const result = parseMarkdown(content)

      expect(result.frontmatter).toEqual({})
      expect(result.markdown).toBe(content + '\n')
    })

    it('should handle empty content', () => {
      const content = ''

      const result = parseMarkdown(content)

      expect(result.frontmatter).toEqual({})
      expect(result.markdown).toBe('')
    })
  })

  describe('Frontmatter Parsing', () => {
    it('should parse complex frontmatter with nested objects', () => {
      const content = `---
title: Complex Chapter
id: complex-01
question:
  type: multiple-choice
  prompt: What is chess?
  options:
    - A board game
    - A sport
    - Both
  correctAnswer: Both
chessPosition: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
---

# Complex Chapter

Content here.`

      const result = parseMarkdown(content)

      expect(result.frontmatter.title).toBe('Complex Chapter')
      expect(result.frontmatter.question).toEqual({
        type: 'multiple-choice',
        prompt: 'What is chess?',
        options: ['A board game', 'A sport', 'Both'],
        correctAnswer: 'Both'
      })
      expect(result.frontmatter.chessPosition).toBe(
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
      )
    })

    it('should handle frontmatter with arrays', () => {
      const content = `---
title: Array Test
tags:
  - chess
  - beginner
  - tactics
keyPoints:
  - Learn piece movement
  - Understand board setup
---

Content with arrays.`

      const result = parseMarkdown(content)

      expect(result.frontmatter.tags).toEqual(['chess', 'beginner', 'tactics'])
      expect(result.frontmatter.keyPoints).toEqual([
        'Learn piece movement',
        'Understand board setup'
      ])
    })

    it('should handle frontmatter with boolean and number values', () => {
      const content = `---
title: Mixed Types
published: true
draft: false
chapterNumber: 5
difficulty: 3.5
---

Mixed type content.`

      const result = parseMarkdown(content)

      expect(result.frontmatter.published).toBe(true)
      expect(result.frontmatter.draft).toBe(false)
      expect(result.frontmatter.chapterNumber).toBe(5)
      expect(result.frontmatter.difficulty).toBe(3.5)
    })
  })

  describe('Markdown Content Processing', () => {
    it('should preserve markdown formatting in content', () => {
      const content = `---
title: Formatting Test
---

# Main Heading

## Subheading

**Bold text** and *italic text*.

- List item 1
- List item 2

\`\`\`javascript
const code = 'example';
\`\`\`

> Blockquote text`

      const result = parseMarkdown(content)

      expect(result.markdown).toContain('# Main Heading')
      expect(result.markdown).toContain('## Subheading')
      expect(result.markdown).toContain('**Bold text** and *italic text*.')
      expect(result.markdown).toContain('* List item 1')
      expect(result.markdown).toContain('```javascript')
      expect(result.markdown).toContain('> Blockquote text')
    })

    it('should handle French special characters', () => {
      const content = `---
title: Caractères Français
---

# Les échecs

Voici des caractères spéciaux français : é, è, ê, à, â, ç, ù, û, ô, î.

**Règles importantes :**
- Déplacer les pièces
- Protéger le roi`

      const result = parseMarkdown(content)

      expect(result.frontmatter.title).toBe('Caractères Français')
      expect(result.markdown).toContain('Les échecs')
      expect(result.markdown).toContain('é, è, ê, à, â, ç, ù, û, ô, î')
      expect(result.markdown).toContain('Règles importantes')
    })
  })

  describe('Edge Cases', () => {
    it('should handle malformed YAML frontmatter gracefully', () => {
      const content = `---
title: Test
invalid: "unclosed array"
---

Content after malformed frontmatter.`

      // Should not throw an error, but may have empty frontmatter
      const result = parseMarkdown(content)

      expect(result).toBeDefined()
      expect(result.markdown).toBeDefined()
      expect(result.frontmatter.title).toBe('Test')
    })

    it('should handle frontmatter with special characters', () => {
      const content = `---
title: "Title with: colons and quotes"
description: 'Single quoted string with "double quotes"'
---

Content here.`

      const result = parseMarkdown(content)

      expect(result.frontmatter.title).toBe('Title with: colons and quotes')
      expect(result.frontmatter.description).toBe('Single quoted string with "double quotes"')
    })

    it('should handle multiple frontmatter blocks (only first should be parsed)', () => {
      const content = `---
title: First Block
---

Some content.

---
title: Second Block
---

More content.`

      const result = parseMarkdown(content)

      expect(result.frontmatter.title).toBe('First Block')
      expect(result.markdown).toContain('Some content.')
      expect(result.markdown).toContain('## title: Second Block')
    })

    it('should handle content with only frontmatter', () => {
      const content = `---
title: Only Frontmatter
description: No content after this
---`

      const result = parseMarkdown(content)

      expect(result.frontmatter.title).toBe('Only Frontmatter')
      expect(result.markdown).toBe('')
    })
  })
})
