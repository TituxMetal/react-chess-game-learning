import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

        <div className="mb-20">
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 w-full">
          <h1 className="text-6xl font-bold text-white mb-8">
      <div className="text-center mb-12">
        <div className="text-6xl mb-6">♟️</div>
          <p className="text-2xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Apprends les Échecs
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl">
          Découvre le monde fascinant des échecs à travers des histoires captivantes. 
          Apprends les règles, maîtrise les stratégies et deviens un véritable champion !
        </p>
        <div className="mb-24">

      {/* GIANT BUTTON */}
            className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold text-3xl px-16 py-8 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25"
            style={{ cursor: 'pointer' }}
        onClick={startLearning}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-6 rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        🚀 COMMENCER L'AVENTURE 🚀
      </button>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl">
        <div className="bg-slate-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Histoires</h3>
            <p className="text-slate-300 text-lg leading-relaxed">Apprends avec des récits captivants</p>
          <p className="text-slate-300">Apprends avec des récits captivants</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Échiquier</h3>
            <p className="text-slate-300 text-lg leading-relaxed">Pratique sur un vrai échiquier</p>
          <p className="text-slate-300">Pratique sur un vrai échiquier</p>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Exercices</h3>
            <p className="text-slate-300 text-lg leading-relaxed">Teste tes connaissances</p>
          <p className="text-slate-300">Teste tes connaissances</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
}
}
}