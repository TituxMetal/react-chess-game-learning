import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'

export const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div className='min-h-screen bg-zinc-900 flex flex-col justify-center items-center px-6 py-8'>
      {/* Chess Icon */}
      <div className='text-6xl mb-8'>♟️</div>

      {/* Title */}
      <h1 className='text-4xl font-semibold text-zinc-100 mb-4 text-center'>
        Apprends les Échecs
      </h1>

      {/* Description */}
      <p className='text-lg text-zinc-300 leading-relaxed max-w-xl text-center mb-12'>
        Découvre le monde des échecs à travers des histoires captivantes.
      </p>

      {/* Big Button */}
      <Button onClick={startLearning} variant='primary' className='px-10 py-3.5 mb-20'>
        Commencer
      </Button>

      {/* Feature Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full'>
        <div className='bg-zinc-800 p-8 rounded-lg border border-zinc-700 text-center'>
          <div className='text-3xl mb-3'>📚</div>
          <h3 className='text-base font-medium text-zinc-100 mb-2'>Histoires</h3>
          <p className='text-zinc-400 text-sm'>Apprends avec des récits</p>
        </div>

        <div className='bg-zinc-800 p-8 rounded-lg border border-zinc-700 text-center'>
          <div className='text-3xl mb-3'>♟️</div>
          <h3 className='text-base font-medium text-zinc-100 mb-2'>Échiquier</h3>
          <p className='text-zinc-400 text-sm'>Pratique les coups</p>
        </div>

        <div className='bg-zinc-800 p-8 rounded-lg border border-zinc-700 text-center'>
          <div className='text-3xl mb-3'>🎯</div>
          <h3 className='text-base font-medium text-zinc-100 mb-2'>Exercices</h3>
          <p className='text-zinc-400 text-sm'>Teste tes connaissances</p>
        </div>
      </div>
    </div>
  )
}
