import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    console.log('Starting learning journey...')
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Apprends les Échecs
            </h1>
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              Découvre le monde fascinant des échecs à travers des histoires captivantes.
              Apprends les règles, les stratégies et deviens un maître du jeu !
            </p>
            
            <button
              onClick={startLearning}
              className="px-10 py-5 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 border border-blue-500/20"
            >
              Commencer l'aventure ♟️
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-5xl mb-6">📚</div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-100">
                Histoires Captivantes
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Apprends à travers des récits engageants qui rendent l'apprentissage amusant et mémorable.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-5xl mb-6">♟️</div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-100">
                Échiquier Interactif
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Pratique directement sur un vrai échiquier et visualise chaque mouvement en temps réel.
              </p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="text-2xl font-semibold mb-4 text-slate-100">
                Exercices Pratiques
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Teste tes connaissances avec des questions et des défis adaptés à ton niveau.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20">
            <h2 className="text-2xl font-semibold mb-4 text-slate-100">
              Pourquoi apprendre les échecs ?
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Les échecs développent la logique, la stratégie et la patience. 
              C'est un jeu millénaire qui stimule l'esprit et offre des heures de plaisir intellectuel.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage