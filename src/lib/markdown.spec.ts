import { describe, it, expect } from 'vitest'
import { parseStoryMarkdown } from './markdown'

describe('parseStoryMarkdown', () => {
  it('should parse valid frontmatter with all fields', async () => {
    const markdown = `---
id: test-story
title: Test Story
chapters:
  - id: chapter-1
    chessPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  - id: chapter-2
    question:
      type: multiple-choice
      prompt: What is a pawn?
      options: ['A piece', 'A board', 'A move']
      correctAnswer: A piece
      explanation: The pawn is a chess piece.
---

## Chapter 1

This is chapter 1 content.

## Chapter 2

This is chapter 2 content.
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.id).toBe('test-story')
    expect(story.title).toBe('Test Story')
    expect(story.chapters).toHaveLength(2)
    expect(story.chapters[0].id).toBe('chapter-1')
    expect(story.chapters[0].chapterNumber).toBe(1)
    expect(story.chapters[0].storyId).toBe('test-story')
  })

  it('should extract multiple chapters correctly', async () => {
    const markdown = `---
id: multi-chapter
title: Multi Chapter Story
chapters:
  - id: ch1
  - id: ch2
  - id: ch3
---

## First Chapter

Content 1

## Second Chapter

Content 2

## Third Chapter

Content 3
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.chapters).toHaveLength(3)
    expect(story.chapters[0].title).toBe('First Chapter')
    expect(story.chapters[1].title).toBe('Second Chapter')
    expect(story.chapters[2].title).toBe('Third Chapter')
    expect(story.chapters[0].content).toContain('Content 1')
    expect(story.chapters[1].content).toContain('Content 2')
    expect(story.chapters[2].content).toContain('Content 3')
  })

  it('should handle FEN position parsing', async () => {
    const fen = 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 4 3'
    const markdown = `---
id: fen-test
title: FEN Test
chapters:
  - id: ch1
    chessPosition: '${fen}'
---

## Chapter

Content
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.chapters[0].chessPosition).toBe(fen)
  })

  it('should handle startpos keyword', async () => {
    const markdown = `---
id: startpos-test
title: Start Position Test
chapters:
  - id: ch1
    chessPosition: startpos
---

## Chapter

Content
`

    const story = await parseStoryMarkdown(markdown)
    const expectedStartPos = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

    expect(story.chapters[0].chessPosition).toBe(expectedStartPos)
  })

  it('should parse multiple-choice question metadata', async () => {
    const markdown = `---
id: question-test
title: Question Test
chapters:
  - id: ch1
    question:
      type: multiple-choice
      prompt: What color is the sky?
      options: ['Blue', 'Red', 'Green']
      correctAnswer: Blue
      explanation: The sky is blue during the day.
---

## Chapter

Content
`

    const story = await parseStoryMarkdown(markdown)
    const question = story.chapters[0].question

    expect(question).toBeDefined()
    expect(question?.type).toBe('multiple-choice')
    expect(question?.prompt).toBe('What color is the sky?')
    expect(question?.options).toEqual(['Blue', 'Red', 'Green'])
    expect(question?.correctAnswer).toBe('Blue')
    expect(question?.explanation).toBe('The sky is blue during the day.')
  })

  it('should parse move-selection question metadata', async () => {
    const markdown = `---
id: move-test
title: Move Test
chapters:
  - id: ch1
    question:
      type: move-selection
      prompt: Find the best move
      correctAnswer: e4
      explanation: e4 opens the center
---

## Chapter

Content
`

    const story = await parseStoryMarkdown(markdown)
    const question = story.chapters[0].question

    expect(question).toBeDefined()
    expect(question?.type).toBe('move-selection')
    expect(question?.prompt).toBe('Find the best move')
    expect(question?.correctAnswer).toBe('e4')
    expect(question?.explanation).toBe('e4 opens the center')
  })

  it('should handle missing optional fields gracefully', async () => {
    const markdown = `---
id: minimal
title: Minimal Story
chapters:
  - id: ch1
---

## Chapter

Content
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.chapters[0].image).toBeUndefined()
    expect(story.chapters[0].chessPosition).toBeUndefined()
    expect(story.chapters[0].question).toBeUndefined()
    expect(story.previousStory).toBeUndefined()
    expect(story.nextStory).toBeUndefined()
  })

  it('should handle French special characters correctly', async () => {
    const markdown = `---
id: french-test
title: Test des caractères français
chapters:
  - id: ch1
    question:
      type: multiple-choice
      prompt: Où est l'éléphant ?
      options: ['À gauche', 'À droite', 'Au centre']
      correctAnswer: À gauche
      explanation: L'éléphant est à gauche près de l'église.
---

## Le château français

Voici l'histoire d'un château où les échecs étaient très populaires. Les joueurs étaient enthousiastes et déterminés à améliorer leur jeu.

Le maître d'échecs disait : « Il faut être précis et réfléchi ! »
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.title).toBe('Test des caractères français')
    expect(story.chapters[0].title).toBe('Le château français')
    expect(story.chapters[0].content).toContain('château')
    expect(story.chapters[0].content).toContain('échecs')
    expect(story.chapters[0].content).toContain('enthousiastes')
    expect(story.chapters[0].content).toContain('déterminés')
    expect(story.chapters[0].content).toContain('améliorer')
    expect(story.chapters[0].content).toContain('précis')
    expect(story.chapters[0].content).toContain('réfléchi')

    const question = story.chapters[0].question
    expect(question?.prompt).toBe('Où est l\'éléphant ?')
    expect(question?.options).toEqual(['À gauche', 'À droite', 'Au centre'])
    expect(question?.correctAnswer).toBe('À gauche')
    expect(question?.explanation).toBe('L\'éléphant est à gauche près de l\'église.')
  })

  it('should throw error when required frontmatter fields are missing', async () => {
    const markdown = `---
title: Missing ID
chapters:
  - id: ch1
---

## Chapter

Content
`

    await expect(parseStoryMarkdown(markdown)).rejects.toThrow(
      'Story frontmatter must include id, title, and chapters'
    )
  })

  it('should handle chapters with image metadata', async () => {
    const markdown = `---
id: image-test
title: Image Test
chapters:
  - id: ch1
    image: chessboard.svg
  - id: ch2
    image: knight.png
---

## Chapter 1

Content 1

## Chapter 2

Content 2
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.chapters[0].image).toBe('chessboard.svg')
    expect(story.chapters[1].image).toBe('knight.png')
  })

  it('should handle navigation links (previousStory and nextStory)', async () => {
    const markdown = `---
id: middle-story
title: Middle Story
chapters:
  - id: ch1
previousStory: story-1
nextStory: story-3
---

## Chapter

Content
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.previousStory).toBe('story-1')
    expect(story.nextStory).toBe('story-3')
  })

  it('should generate chapter numbers sequentially', async () => {
    const markdown = `---
id: numbering-test
title: Numbering Test
chapters:
  - id: first
  - id: second
  - id: third
  - id: fourth
---

## Chapter A

Content A

## Chapter B

Content B

## Chapter C

Content C

## Chapter D

Content D
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.chapters[0].chapterNumber).toBe(1)
    expect(story.chapters[1].chapterNumber).toBe(2)
    expect(story.chapters[2].chapterNumber).toBe(3)
    expect(story.chapters[3].chapterNumber).toBe(4)
  })

  it('should use fallback title when chapter title is not in content', async () => {
    const markdown = `---
id: no-title-test
title: No Title Test
chapters:
  - id: ch1
  - id: ch2
---

Content without h2 header
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.chapters[0].title).toBe('Chapter 1')
  })

  it('should handle chapter with explicit title in metadata', async () => {
    const markdown = `---
id: explicit-title-test
title: Explicit Title Test
chapters:
  - id: ch1
    title: Custom Chapter Title
---

## This header will be ignored

Content
`

    const story = await parseStoryMarkdown(markdown)

    expect(story.chapters[0].title).toBe('Custom Chapter Title')
  })
})
