import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 flex flex-col justify-center items-center px-8 py-16">
      {/* Main Content Container */}
      <div className="text-center max-w-6xl mx-auto space-y-16">
        
        {/* Chess Icon */}
        <div className="text-8xl mb-8">♟️</div>
        
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-8">
          Apprends les Échecs
        </h1>
        
        {/* Description */}
        <p className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-4xl mx-auto mb-16">
          Découvre le monde fascinant des échecs à travers des histoires captivantes. 
          Apprends les règles, maîtrise les stratégies et deviens un véritable champion !
        </p>

        {/* Big Button */}
        <div className="mb-24">
          <button
            onClick={startLearning}
            className="cursor-pointer bg-orange-500 hover:bg-orange-400 text-white font-bold text-3xl md:text-4xl px-16 py-8 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-orange-300"
            style={{ cursor: 'pointer' }}
          >
            🚀 COMMENCER L'AVENTURE 🚀
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="bg-slate-800/80 p-10 rounded-xl text-center backdrop-blur-sm border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-6">📚 Histoires</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Apprends avec des récits captivants
            </p>
          </div>
          
          <div className="bg-slate-800/80 p-10 rounded-xl text-center backdrop-blur-sm border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-6">♟️ Échiquier</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Pratique sur un vrai échiquier
            </p>
          </div>
          
          <div className="bg-slate-800/80 p-10 rounded-xl text-center backdrop-blur-sm border border-slate-600">
            <h3 className="text-2xl font-bold text-white mb-6">🎯 Exercices</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Teste tes connaissances
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage