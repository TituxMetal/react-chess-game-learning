import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    console.log('Starting chess learning journey!')
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-950"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-16 pb-8">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-8 shadow-2xl">
              <span className="text-4xl">♟️</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Apprends les Échecs
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Découvre le monde fascinant des échecs à travers des histoires captivantes. 
              Apprends les règles, maîtrise les stratégies et deviens un véritable champion !
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container mx-auto px-6 text-center">
            
            {/* GIANT CALL TO ACTION BUTTON */}
            <div className="mb-20">
              <button
                onClick={startLearning}
                className="group relative inline-flex items-center justify-center px-16 py-8 text-3xl md:text-4xl font-black text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl border-4 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] active:scale-95 cursor-pointer min-w-[500px] min-h-[100px] animate-pulse hover:animate-none"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                <span className="mr-4 text-5xl">🚀</span>
                COMMENCER L'AVENTURE
                <span className="ml-4 text-5xl">♟️</span>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
              </button>
              
              <p className="mt-6 text-lg text-slate-400 font-medium">
                Clique pour commencer ton voyage vers la maîtrise des échecs ! 🏆
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group bg-slate-800/40 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:bg-slate-700/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-blue-500/50 cursor-pointer">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">📚</div>
                <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-blue-400 transition-colors">Histoires Captivantes</h3>
                <p className="text-slate-300 text-xl leading-relaxed">Apprends avec des récits immersifs qui rendent l'apprentissage amusant et mémorable</p>
              </div>
              
              <div className="group bg-slate-800/40 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:bg-slate-700/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-purple-500/50 cursor-pointer">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">♟️</div>
                <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-purple-400 transition-colors">Échiquier Interactif</h3>
                <p className="text-slate-300 text-xl leading-relaxed">Pratique sur un véritable échiquier avec des pièces que tu peux déplacer</p>
              </div>
              
              <div className="group bg-slate-800/40 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50 hover:bg-slate-700/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-cyan-500/50 cursor-pointer">
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-300">🎯</div>
                <h3 className="text-3xl font-bold mb-6 text-white group-hover:text-cyan-400 transition-colors">Exercices Ludiques</h3>
                <p className="text-slate-300 text-xl leading-relaxed">Teste tes connaissances avec des quiz interactifs et des défis progressifs</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-12">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center space-x-4 text-slate-400 text-lg">
              <span>🏆</span>
              <span>Prêt à devenir un maître des échecs ?</span>
              <span>🏆</span>
            </div>
            <div className="mt-6 flex justify-center space-x-8 text-slate-500">
              <span className="flex items-center space-x-2">
                <span>⭐</span>
                <span>Apprentissage progressif</span>
              </span>
              <span className="flex items-center space-x-2">
                <span>🎮</span>
                <span>Exercices interactifs</span>
              </span>
              <span className="flex items-center space-x-2">
                <span>🧠</span>
                <span>Développe ta stratégie</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage