import { Routes, Route } from 'react-router-dom'


import HomePage from './pages/HomePage'
import StoryPage from './pages/StoryPage'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyId/chapter/:chapterId" element={<StoryPage />} />
      </Routes>
    </div>
  )
}

export default App