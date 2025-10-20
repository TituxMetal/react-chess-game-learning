# Chess Game Learning - Architecture Document

**Project:** Chess Game Learning  
**Date:** 2025-10-20  
**Author:** TituxMetal

## Executive Summary

The Chess Game Learning application is a modern React-based educational platform that teaches chess
fundamentals through interactive, story-driven lessons. The architecture follows a component-based
design with reactive state management, emphasizing maintainability, testability, and user
experience.

**Key Architectural Decisions:**

- **Frontend-Only Architecture**: React application with client-side routing, no backend
  dependencies
- **Reactive State Management**: Nanostores for lightweight, atomic state management
- **Content-as-Code**: Markdown files with YAML frontmatter for educational content
- **Component Composition**: Modular React components with custom hooks for logic separation
- **Type Safety**: Full TypeScript implementation with strict mode enabled

## 1. Technology Stack and Decisions

### 1.1 Technology Decision Table

| Category           | Technology       | Version | Justification                                                          |
| ------------------ | ---------------- | ------- | ---------------------------------------------------------------------- |
| Frontend Framework | React            | 19.1.1  | Modern React with concurrent features, excellent TypeScript support    |
| Language           | TypeScript       | 5.9.2   | Type safety, better developer experience, compile-time error detection |
| Build Tool         | Vite             | 7.1.7   | Fast development server, optimized production builds, excellent HMR    |
| State Management   | Nanostores       | 1.0.1   | Lightweight, atomic stores, excellent React integration                |
| Routing            | React Router     | 7.9.3   | Declarative routing, nested routes, URL parameter handling             |
| Styling            | Tailwind CSS     | 4.1.13  | Utility-first CSS, consistent design system, responsive design         |
| Chess Logic        | chess.js         | 1.4.0   | Comprehensive chess move validation and game logic                     |
| Chess UI           | react-chessboard | 5.6.1   | Interactive SVG-based chessboard with drag-and-drop                    |
| Content Processing | react-markdown   | 10.1.0  | Markdown rendering with plugin support                                 |
| Testing            | Vitest           | 3.2.4   | Fast unit testing with React Testing Library integration               |

### 1.2 Architecture Rationale

**Nanostores over Redux/Zustand**: Chosen for its atomic approach, minimal boilerplate, and
excellent performance with React. Each store manages a specific domain (progress, chess state,
questions) without complex reducers.

**Vite over Create React App**: Superior development experience with instant HMR, faster builds, and
modern ES modules support. Native TypeScript support without additional configuration.

**Markdown Content Strategy**: Educational content stored as markdown files enables version control,
easy editing, and separation of content from code. YAML frontmatter provides structured metadata.

## 2. Application Architecture

### 2.1 Architecture Pattern

The application follows a **Component-Driven Architecture** with the following layers:

```text
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│  (Pages, Components, UI Elements)       │
├─────────────────────────────────────────┤
│              Business Logic Layer        │
│  (Custom Hooks, Utilities, Validation)  │
├─────────────────────────────────────────┤
│              State Management Layer      │
│  (Nanostores: Progress, Chess, Questions)│
├─────────────────────────────────────────┤
│              Data Layer                  │
│  (Markdown Content, Story Index)        │
└─────────────────────────────────────────┘
```

### 2.2 Routing Strategy

**Route Structure:**

- `/` - Home page with welcome message and start button
- `/story/:storyId/chapter/:chapterId` - Main learning interface
- `/story/:storyId/completion` - Story completion page

**Navigation Flow:**

1. Home → First story/chapter
2. Chapter → Next chapter (same story)
3. Last chapter → Completion page
4. Completion → Next story or home

### 2.3 Data Flow Architecture

```text
User Interaction → Custom Hook → Nanostore → Component Re-render
                ↓
        Side Effects (Navigation, Persistence)
```

**Unidirectional Data Flow:**

1. User interactions trigger custom hook functions
2. Hooks update nanostores using action functions
3. Components subscribe to stores via `useStore()` hook
4. State changes trigger React re-renders
5. Side effects (navigation, persistence) handled in hooks

## 3. State Management Architecture

### 3.1 Store Structure

**progressStore (Map Store)**

```typescript
interface Progress {
  completedChapters: Set<string> // "storyId-chapterId" format
  currentStory: string | null // Current story ID
  currentChapter: string | null // Current chapter ID
}
```

**chessStore (Atom Store)**

```typescript
interface ChessState {
  position: string // FEN notation
  selectedSquare: string | null // Currently selected square
  validMoves: string[] // Valid moves for selected piece
  isInteractive: boolean // Whether board accepts input
}
```

**questionStore (Atom Store)**

```typescript
interface QuestionState {
  selectedAnswer: string | null // User's selected answer
  isCorrect: boolean | null // Answer correctness
  submitted: boolean // Whether answer was submitted
}
```

### 3.2 Store Interactions

- **Progress Store**: Tracks learning progress across sessions, persists completion state
- **Chess Store**: Manages chess board state, piece selection, and move validation
- **Question Store**: Handles question answering flow, feedback display, and statistics

### 3.3 Persistence Strategy

Currently uses in-memory storage with nanostores for simplicity and focus.

## 4. Component Architecture

### 4.1 Component Hierarchy

```text
App
├── ErrorBoundary
├── Routes
    ├── HomePage
    ├── StoryViewer
    │   ├── ProgressBar
    │   ├── ReactMarkdown (content)
    │   ├── ChessBoard
    │   ├── QuestionComponent
    │   │   ├── MultipleChoice
    │   │   └── MoveBasedQuestion
    │   └── NavigationButtons
    └── CompletionPage
```

### 4.2 Component Responsibilities

**StoryViewer** (Container Component)

- Orchestrates learning experience
- Manages chapter loading and navigation
- Coordinates progress tracking
- Handles question answering flow

**QuestionComponent** (Smart Component)

- Renders appropriate question type
- Manages answer submission
- Displays feedback and explanations
- Integrates with chess board for move-based questions

**ChessBoard** (Presentation Component)

- Renders interactive chess position
- Handles piece movement and selection
- Validates moves using chess.js
- Provides visual feedback for valid/invalid moves

### 4.3 Custom Hooks Architecture

**useStory(storyId, chapterId)**

- Loads markdown content via dynamic imports
- Parses frontmatter and content
- Manages loading and error states
- Returns structured chapter data

**useProgress()**

- Provides progress store interface
- Exposes completion tracking functions
- Manages current chapter state
- Returns progress data and actions

**useStoryNavigation(storyId, chapterId)**

- Calculates next/previous chapters
- Handles story transitions
- Manages completion flow
- Provides navigation functions

**useChapterProgress(storyId, chapterId, storyIndex, setCurrent)**

- Manages chapter-specific progress
- Handles question display logic
- Calculates chapter numbers and totals
- Coordinates with progress store

## 5. Content Architecture

### 5.1 Content Structure

```text
src/stories/
├── index.json                    # Story index with navigation
├── 01-introduction/
│   ├── 01-what-is-chess.md
│   ├── 02-the-chessboard.md
│   └── 03-the-pieces-overview.md
├── 02-piece-moves/
│   ├── 01-pawn.md
│   ├── 02-knight.md
│   └── ...
└── ...
```

### 5.2 Content Format

**Markdown with YAML Frontmatter:**

```yaml
---
id: chapter-1
title: 'Chapter Title'
chapterNumber: 1
storyId: story-id
question:
  type: multiple-choice
  prompt: 'Question text'
  options: ['A', 'B', 'C']
  correctAnswer: 'A'
  explanation: 'Explanation text'
chessPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
---
# Chapter Content

Markdown content here...
```

### 5.3 Dynamic Content Loading

Content is loaded dynamically using Vite's `import()` with `?raw` suffix:

```typescript
const content = await import(`~/stories/${storyId}/${chapterId}.md?raw`)
```

This approach enables:

- Code splitting by chapter
- Lazy loading of content
- Build-time optimization
- Type-safe imports with TypeScript

## 6. Testing Strategy

### 6.1 Testing Architecture

**Unit Tests (Vitest + React Testing Library)**

- Component behavior testing
- Custom hook testing
- Store logic testing
- Utility function testing

**Coverage Requirements:**

- 90%+ statement coverage achieved
- 100% coverage for critical paths (stores, hooks)
- Comprehensive error scenario testing

### 6.2 Test Organization

```text
src/
├── components/
│   ├── Component.tsx
│   └── Component.spec.tsx
├── hooks/
│   ├── useHook.ts
│   └── useHook.spec.ts
└── stores/
    ├── store.ts
    └── store.spec.ts
```

### 6.3 Testing Patterns

- **Store Testing**: Direct store manipulation and subscription testing
- **Hook Testing**: `renderHook` with act() for state changes
- **Component Testing**: User interaction simulation with user-event
- **Integration Testing**: Full user flow testing (removed for clean output)

## 7. Build and Development

### 7.1 Development Workflow

```bash
pnpm dev          # Development server with HMR
pnpm test         # Run tests in watch mode
pnpm test:coverage # Generate coverage reports
pnpm build        # Production build
pnpm preview      # Preview production build
```

### 7.2 Build Configuration

**Vite Configuration Highlights:**

- TypeScript path aliases (`~` → `./src`)
- Markdown file imports as raw text
- Tailwind CSS integration
- Test environment setup with happy-dom
- Coverage reporting with v8 provider

### 7.3 Code Quality

- **ESLint**: TypeScript-aware linting with React rules
- **TypeScript**: Strict mode enabled for maximum type safety
- **Prettier**: Code formatting (implied by consistent style)
- **Vitest**: Fast testing with excellent TypeScript support

## 8. Performance Considerations

### 8.1 Optimization Strategies

- **Code Splitting**: Dynamic imports for markdown content
- **Lazy Loading**: Content loaded only when needed
- **Memoization**: React.memo for expensive components
- **Efficient Re-renders**: Atomic stores minimize unnecessary updates

### 8.2 Bundle Optimization

- **Tree Shaking**: Vite automatically removes unused code
- **Asset Optimization**: SVG chess pieces, optimized images
- **Minimal Dependencies**: Lightweight state management, focused libraries

## 9. Security Architecture

### 9.1 Client-Side Security

**Content Security Policy (CSP)**

- Restrict script sources to prevent XSS attacks
- Control resource loading for enhanced security
- Implement nonce-based inline script execution

**Input Validation**

- Chess move validation through chess.js library
- Sanitized markdown rendering via react-markdown
- Type-safe interfaces prevent injection attacks

**Data Privacy**

- No external data transmission
- Local-only progress storage

### 9.2 Dependency Security

- Regular dependency updates via automated tools
- Vulnerability scanning in CI/CD pipeline
- Minimal dependency surface area reduces attack vectors

## 10. Deployment Architecture

### 10.1 Static Site Deployment

**Build Output:**

```text
dist/
├── index.html              # Entry point
├── assets/
│   ├── index-[hash].js     # Main application bundle
│   ├── index-[hash].css    # Compiled styles
│   └── chunks/             # Code-split chunks
└── stories/                # Markdown content files
```

**Deployment Targets:**

- **Netlify/Vercel**: Automatic deployments from Git
- **GitHub Pages**: Static hosting for open source
- **Local Server**: Self-hosted with nginx/Apache
- **CDN Distribution**: Global content delivery

### 10.2 Environment Configuration

**Development Environment:**

- Hot module replacement for instant feedback
- Source maps for debugging
- Comprehensive error reporting

**Production Environment:**

- Minified and optimized bundles
- Asset compression and caching
- Error boundaries for graceful degradation

## 11. Monitoring and Observability

### 11.1 Error Tracking

**React Error Boundaries:**

- Component-level error isolation
- Fallback UI for broken components
- Error reporting to console (development)

**Runtime Error Handling:**

- Async operation error catching
- Network request failure handling
- Content loading error recovery

### 11.2 Performance Monitoring

**Core Web Vitals:**

- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1

**Application Metrics:**

- Chapter load times
- User interaction response times
- Memory usage patterns

## 12. Development Guidelines

### 12.1 Code Organization Principles

**Feature-Based Structure:**

```text
src/
├── components/          # Reusable UI components
├── pages/              # Route-level components
├── features/           # Feature-specific components
├── hooks/              # Custom React hooks
├── stores/             # Nanostore state management
├── utils/              # Pure utility functions
├── types/              # TypeScript type definitions
└── entities/           # Domain-specific components
```

**Naming Conventions:**

- Components: PascalCase (`StoryViewer`)
- Hooks: camelCase with `use` prefix (`useStory`)
- Stores: camelCase with descriptive suffix (`progressStore`)
- Types: PascalCase interfaces (`ChapterData`)

### 12.2 Component Design Patterns

**Container/Presentation Pattern:**

- Container components manage state and logic
- Presentation components handle UI rendering
- Clear separation of concerns

**Custom Hook Pattern:**

- Extract complex logic into reusable hooks
- Encapsulate state management and side effects
- Enable easy testing and composition

**Composition over Inheritance:**

- Favor component composition
- Use render props and children patterns
- Avoid deep component hierarchies

### 12.3 State Management Guidelines

**Store Granularity:**

- One store per domain concept
- Atomic updates for performance
- Minimal store interdependencies

**Action Patterns:**

- Pure functions for store updates
- Descriptive action names
- Consistent parameter patterns

## 13. Architecture Decision Records (ADRs)

### ADR-001: Nanostores for State Management

**Status:** Accepted **Date:** 2025-10-08

**Context:** Need lightweight state management for progress tracking, chess state, and question
handling.

**Decision:** Use Nanostores instead of Redux or Zustand.

**Rationale:**

- Minimal boilerplate compared to Redux
- Atomic stores prevent unnecessary re-renders
- Excellent TypeScript integration
- Small bundle size impact

**Consequences:**

- Learning curve for team members familiar with Redux
- Less ecosystem tooling compared to Redux
- Excellent performance characteristics

### ADR-002: Markdown Content Strategy

**Status:** Accepted **Date:** 2025-10-08

**Context:** Need maintainable way to manage educational content.

**Decision:** Use Markdown files with YAML frontmatter stored in source code.

**Rationale:**

- Version control for content changes
- Easy editing without technical knowledge
- Build-time optimization and validation
- Separation of content from application logic

**Consequences:**

- Content changes require application rebuild
- No runtime content management interface
- Excellent developer experience for content updates

### ADR-003: Frontend-Only Architecture

**Status:** Accepted **Date:** 2025-10-08

**Context:** Educational application with no user accounts or dynamic data.

**Decision:** Build as static React application with client-side routing, no backend.

**Rationale:**

- Simplified deployment and hosting
- No server maintenance overhead
- Excellent performance and caching
- Suitable for educational content delivery

**Consequences:**

- No user account management
- Excellent scalability and cost efficiency

---

_This architecture document reflects the current state of the Chess Game Learning application and
serves as a guide for development and maintenance._
