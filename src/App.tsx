import { Routes, Route } from 'react-router-dom'


import HomePage from './pages/HomePage'
import StoryViewer from './components/StoryViewer'

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyId/chapter/:chapterId" element={<StoryViewer />} />
      </Routes>
    </div>
  )
}

export default App