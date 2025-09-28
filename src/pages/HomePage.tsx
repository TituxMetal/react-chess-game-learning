import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    console.log('Button clicked!')
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Title */}
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Apprends les Échecs
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed">
              Découvre le monde fascinant des échecs à travers des histoires captivantes. 
              Apprends les règles, les stratégies et deviens un maître du jeu !
            </p>
          </div>
          
          {/* MASSIVE BUTTON */}
          <div className="mb-20">
            <button
              onClick={startLearning}
              className="cursor-pointer inline-block px-12 py-6 text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 hover:from-blue-600 hover:via-purple-700 hover:to-blue-600 text-white rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-2xl border-4 border-white/30 backdrop-blur-sm animate-pulse hover:animate-none active:scale-95"
              style={{
                minWidth: '400px',
                minHeight: '80px',
                fontSize: '28px',
                fontWeight: '900',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                cursor: 'pointer'
              }}
            >
              🚀 COMMENCER L'AVENTURE ♟️
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-5xl mb-6">📚</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Histoires</h3>
              <p className="text-slate-300 text-lg">Apprends avec des récits captivants</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-5xl mb-6">♟️</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Échiquier</h3>
              <p className="text-slate-300 text-lg">Pratique sur un vrai échiquier</p>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/50 hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="text-5xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-white">Exercices</h3>
              <p className="text-slate-300 text-lg">Teste tes connaissances</p>
            </div>
          </div>

          {/* Additional spacing */}
          <div className="mt-20 text-slate-400">
            <p className="text-lg">Prêt à devenir un maître des échecs ? 🏆</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HomePage