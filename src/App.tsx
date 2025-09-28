import { Routes, Route } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Chess Learning App</h1>
      <p className="text-xl">This is working!</p>
      <button 
        onClick={() => console.log('Button clicked!')}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Test Button
      </button>
    </div>
  )
}

const TestStoryPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Story Page</h1>
      <p className="text-xl">Story page is working!</p>
    </div>
  )
}

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyId/chapter/:chapterId" element={<TestStoryPage />} />
      </Routes>
    </div>
  )
}

export default App