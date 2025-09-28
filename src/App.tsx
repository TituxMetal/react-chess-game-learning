import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StoryPage from './pages/StoryPage'
import CompletionPage from './pages/CompletionPage'

const App = () => {
  return (
    <div className="min-h-screen bg-dark-950">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyId/chapter/:chapterId" element={<StoryPage />} />
        <Route path="/completion/:storyId" element={<CompletionPage />} />
      </Routes>
    </div>
  )
}

export default App