import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const HomePage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startLearning = () => {
    // Navigate to the first story and chapter
    navigate('/story/01-introduction/chapter/01-what-is-chess')
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
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
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
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">
                Histoires Captivantes
              </h3>
              <p className="text-slate-300">
                Apprends à travers des récits engageants qui rendent l'apprentissage amusant et mémorable.
              </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">♟️</div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">
                Échiquier Interactif
              </h3>
              <p className="text-slate-300">
                Pratique directement sur un vrai échiquier et visualise chaque mouvement en temps réel.
              </p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-slate-100">
                Exercices Pratiques
              </h3>
              <p className="text-slate-300">
                Teste tes connaissances avec des questions et des défis adaptés à ton niveau.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-8">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage