import { Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from './components/ErrorBoundary'
import { StoryViewer } from './components/StoryViewer'
import { CompletionPage } from './pages/CompletionPage'
import { HomePage } from './pages/HomePage'

export const App = () => {
  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-zinc-900'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/story/:storyId/chapter/:chapterId' element={<StoryViewer />} />
          <Route path='/story/:storyId/completion' element={<CompletionPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}
