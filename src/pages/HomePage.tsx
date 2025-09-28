import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    console.log('Button clicked!')
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Title */}
          <h1 className="text-6xl font-bold mb-8 text-blue-400">
            Apprends les Échecs
          </h1>
          
          {/* Description */}
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Découvre le monde fascinant des échecs à travers des histoires captivantes.
            Apprends les règles, les stratégies et deviens un maître du jeu !
          </p>
          
          {/* BIG BUTTON */}
          <div className="mb-16">
            <button
              onClick={startLearning}
              className="px-12 py-6 text-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🚀 COMMENCER L'AVENTURE ♟️
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Histoires</h3>
              <p className="text-slate-300">Apprends avec des récits captivants</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl">
              <div className="text-4xl mb-4">♟️</div>
              <h3 className="text-xl font-semibold mb-2">Échiquier</h3>
              <p className="text-slate-300">Pratique sur un vrai échiquier</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Exercices</h3>
              <p className="text-slate-300">Teste tes connaissances</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default HomePage