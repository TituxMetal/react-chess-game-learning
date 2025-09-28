import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 w-full p-16">
      <div className="text-center mb-32">
        <div className="text-6xl mb-6">♟️</div>
        <h1 className="text-6xl font-bold text-white mb-8">
          Apprends les Échecs
        </h1>
        <p className="text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto mb-16">
          Découvre le monde fascinant des échecs à travers des histoires captivantes. 
          Apprends les règles, maîtrise les stratégies et deviens un véritable champion !
        </p>

        <button
          onClick={startLearning}
          className="cursor-pointer bg-orange-500 hover:bg-orange-400 text-white font-bold text-4xl px-20 py-12 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl border-4 border-orange-300"
          style={{ cursor: 'pointer' }}
        >
          🚀 COMMENCER L'AVENTURE 🚀
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto">
        <div className="bg-slate-800/80 p-12 rounded-lg text-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6">Histoires</h3>
          <p className="text-slate-300 text-lg leading-relaxed">Apprends avec des récits captivants</p>
        </div>
        
        <div className="bg-slate-800/80 p-12 rounded-lg text-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6">Échiquier</h3>
          <p className="text-slate-300 text-lg leading-relaxed">Pratique sur un vrai échiquier</p>
        </div>
        
        <div className="bg-slate-800/80 p-12 rounded-lg text-center backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-white mb-6">Exercices</h3>
          <p className="text-slate-300 text-lg leading-relaxed">Teste tes connaissances</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage