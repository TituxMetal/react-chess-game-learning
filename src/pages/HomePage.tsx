import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">♟️</div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Apprends les Échecs
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl">
          Découvre le monde fascinant des échecs à travers des histoires captivantes. 
          Apprends les règles, maîtrise les stratégies et deviens un véritable champion !
        </p>
      </div>

      {/* GIANT BUTTON */}
      <button
        onClick={startLearning}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-6 rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        🚀 COMMENCER L'AVENTURE 🚀
      </button>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-white mb-2">Histoires</h3>
          <p className="text-slate-300">Apprends avec des récits captivants</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-4xl mb-4">♟️</div>
          <h3 className="text-xl font-bold text-white mb-2">Échiquier</h3>
          <p className="text-slate-300">Pratique sur un vrai échiquier</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-2">Exercices</h3>
          <p className="text-slate-300">Teste tes connaissances</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage