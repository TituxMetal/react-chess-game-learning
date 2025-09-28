# Project Overview

An interactive web application designed to teach chess from zero, using story-driven lessons in
French.  
The app guides users through the rules, piece movements, and basic strategies, with interactive
chessboards and questions.

## Goals & Audience

- Teach chess to absolute beginners.
- Use French stories for explanations.
- Provide interactive exercises after each concept.
- Track user progress and encourage learning.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Nanostores
- **Routing**: React Router
- **Content**: Markdown with YAML frontmatter for stories
- **Chessboard**: react-chessboard (SVG-based)
- **Markdown Parsing**: marked
- **Frontmatter Parsing**: gray-matter

## Core Features

- Story-driven lessons in French
- Interactive chessboard (SVG, react-chessboard)
- Multiple question types (choice, move selection)
- Immediate feedback and explanations
- Progress tracking and chapter navigation
- Completion summary and encouragement

## User Flow

1. Home page: Welcome, start story
2. Story viewer: Read chapter, interact with chessboard/question
3. Feedback: See result, explanation
4. Navigation: Next/previous chapter
5. Completion: Summary and encouragement

## Functional Requirements

- Display story chapters with text, images, and chessboard positions.
- Support multiple question types: multiple choice, move selection.
- Validate user answers and moves, provide instant feedback.
- Track progress through chapters and stories.
- Responsive design for desktop and mobile.
- Accessibility: keyboard navigation, alt text for images.

## Non-Functional Requirements

- Fast load times and smooth interactions.
- Modular, maintainable codebase.
- Easy to add/edit stories via Markdown files.
- SVG assets for crisp, scalable graphics.

## Pages & Navigation

- **Home Page**: Welcome, app introduction, start button.
- **Story Page**: Displays chapter text, chessboard, questions, feedback, navigation buttons,
  progress bar.
- **Completion Page**: Summary of learning, encouragement, option to restart or choose another
  story.

- **Routing**:
  - Use React Router for navigation between pages and chapters.
  - Route format: `/story/:storyId/chapter/:chapterId`
  - Navigation logic uses a JSON index to determine next/previous chapters and stories.

## Component Architecture

- `ChessboardComponent`: Renders chessboard, handles moves.
- `StoryViewer`: Displays chapter, chessboard, questions, feedback, navigation.
- `Feedback`: Shows correct/incorrect feedback and explanations.
- `ProgressBar`: Indicates chapter progress.
- `NavigationButtons`: Next/previous chapter navigation.

## Custom Hooks

- `useStory`: Loads and parses the current Markdown story.
- `useProgress`: Tracks user progress through chapters and stories.
- `useChessboard`: Manages chessboard state and move validation.

## File Structure

```text
src/
  components/      # UI components (Chessboard, StoryViewer, Feedback, etc.)
  pages/           # Main screens (Home, Story, Completion)
  stories/         # Markdown story files (French content)
  assets/          # SVG images for pieces/board
  stores/          # Nanostore state management
  hooks/           # Custom React hooks (useStory, useProgress, useChessboard)
  utils/           # Utility functions (Markdown parsing, etc.)
  styles/          # Tailwind and custom styles
```

## Key Components

- **ChessboardComponent**: Renders chessboard, handles moves.
- **StoryViewer**: Displays chapter text, chessboard, and questions.
- **Feedback**: Shows correct/incorrect feedback and explanations.
- **ProgressBar**: Indicates chapter progress.
- **NavigationButtons**: Next/previous chapter navigation.

## Data Model Example

```markdown
---
id: intro-pieces
title: "Découverte des pièces d'échecs"
chapters:
  - id: board-intro
    image: chessboard.svg
  - id: pawn-intro
    image: pawn.svg
    chessPosition: startpos
    question:
      type: multiple-choice
      prompt: 'Dans quelle direction le pion peut-il avancer ?'
      options: ['En avant', 'En arrière', 'Sur le côté']
      correctAnswer: 'En avant'
      explanation: "Les pions ne peuvent avancer que vers l'avant, mais ils capturent en diagonale."
---
```

## Next Steps

- Scaffold project with Vite + React + TypeScript.
- Set up Tailwind CSS for styling.
- Create Markdown story template with YAML frontmatter.
- Build core components: StoryViewer, ChessboardComponent, Feedback.
- Integrate react-chessboard for interactive board.
- Implement hooks and state management.
- Add sample story in French for testing.

## Milestones

- Project setup and initial file structure.
- Markdown story parsing and rendering.
- Chessboard integration and move validation.
- Question/answer logic and feedback UI.
- Progress tracking and navigation.
- Responsive and accessible design.
- First complete story lesson in French.

## References

- [React documentation](https://react.dev/)
- [Vite documentation](https://vitejs.dev/)
- [Tailwind CSS documentation](https://tailwindcss.com/docs)
- [React Router documentation](https://reactrouter.com/)
- [Nanostores documentation](https://nanostores.dev/)
- [react-chessboard documentation](https://github.com/Clariity/react-chessboard)
- [marked documentation](https://github.com/markedjs/marked)
- [gray-matter documentation](https://github.com/jonschlinkert/gray-matter)
