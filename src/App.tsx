import { Route, Routes } from 'react-router-dom'

import { StoryViewer } from './components/StoryViewer'
import { HomePage } from './pages/HomePage'

export const App = () => {
  return (
    <div className='min-h-screen bg-slate-900'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/story/:storyId/chapter/:chapterId' element={<StoryViewer />} />
      </Routes>
    </div>
  )
}
