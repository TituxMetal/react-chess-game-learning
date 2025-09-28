import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { loadStoryIndex } from '../utils/navigation'
import { StoryIndex } from '../types/story'

const HomePage = () => {
  const navigate = useNavigate()
  const [storyIndex, setStoryIndex] = useState<StoryIndex[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoryIndex().then(index => {
      setStoryIndex(index)
      setLoading(false)
    })
  }, [])

  const startLearning = () => {
    if (storyIndex.length > 0 && storyIndex[0].chapters.length > 0) {
      const firstStory = storyIndex[0]
      const firstChapter = firstStory.chapters[0]
      navigate(`/story/${firstStory.id}/chapter/${firstChapter.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Apprends les Échecs
            </h1>
            <p className="text-xl text-dark-300 mb-8 leading-relaxed">
              Découvre le monde fascinant des échecs à travers des histoires captivantes.
              Apprends les règles, les stratégies et deviens un maître du jeu !
            </p>
            
            <button
              onClick={startLearning}
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Commencer l'aventure ♟️
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-dark-100">
                Histoires Captivantes
              </h3>
              <p className="text-dark-300">
                Apprends à travers des récits engageants qui rendent l'apprentissage amusant et mémorable.
              </p>
            </div>
            
            <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
              <div className="text-4xl mb-4">♟️</div>
              <h3 className="text-xl font-semibold mb-3 text-dark-100">
                Échiquier Interactif
              </h3>
              <p className="text-dark-300">
                Pratique directement sur un vrai échiquier et visualise chaque mouvement en temps réel.
              </p>
            </div>
            
            <div className="bg-dark-800 p-6 rounded-xl border border-dark-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-dark-100">
                Exercices Pratiques
              </h3>
              <p className="text-dark-300">
                Teste tes connaissances avec des questions et des défis adaptés à ton niveau.
              </p>
            </div>
          </div>

          {/* Story Overview */}
          {storyIndex.length > 0 && (
            <div className="bg-dark-800 rounded-xl p-8 border border-dark-700">
              <h2 className="text-2xl font-bold mb-6 text-dark-100">
                Ton Parcours d'Apprentissage
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storyIndex.map((story, index) => (
                  <div key={story.id} className="bg-dark-700 p-4 rounded-lg border border-dark-600">
                    <div className="flex items-center mb-2">
                      <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full mr-3">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-dark-100">{story.title}</h3>
                    </div>
                    <p className="text-sm text-dark-300">
                      {story.chapters.length} chapitre{story.chapters.length > 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage