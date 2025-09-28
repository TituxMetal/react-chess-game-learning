import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex flex-col justify-center items-center px-8 py-16">
      
      {/* Chess Icon */}
      <div className="text-8xl mb-8">♟️</div>
      
      {/* Title */}
      <h1 className="text-6xl font-bold text-white mb-8 text-center max-w-4xl">
        Apprends les Échecs
      </h1>
      
      {/* Description */}
      <p className="text-2xl text-slate-200 leading-relaxed max-w-4xl text-center mb-16">
        Découvre le monde fascinant des échecs à travers des histoires captivantes. 
        Apprends les règles, maîtrise les stratégies et deviens un véritable champion !
      </p>

      {/* Big Button */}
      <button
        onClick={startLearning}
        className="bg-orange-500 hover:bg-orange-600 text-white text-4xl font-bold px-20 py-12 rounded-2xl border-4 border-orange-300 cursor-pointer mb-24 transform hover:scale-105 transition-all duration-300 shadow-2xl"
      >
        🚀 COMMENCER L'AVENTURE 🚀
      </button>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl w-full">
        <div className="bg-slate-800/80 backdrop-blur-sm p-12 rounded-2xl border border-slate-600 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            📚 Histoires
          </h3>
          <p className="text-slate-300 text-lg">
            Apprends avec des récits captivants
          </p>
        </div>
        
        <div className="bg-slate-800/80 backdrop-blur-sm p-12 rounded-2xl border border-slate-600 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            ♟️ Échiquier
          </h3>
          <p className="text-slate-300 text-lg">
            Pratique sur un vrai échiquier
          </p>
        </div>
        
        <div className="bg-slate-800/80 backdrop-blur-sm p-12 rounded-2xl border border-slate-600 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            🎯 Exercices
          </h3>
          <p className="text-slate-300 text-lg">
            Teste tes connaissances
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage