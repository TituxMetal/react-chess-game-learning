interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export const ProgressBar = ({ current, total, className = '' }: ProgressBarProps) => {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={`w-full ${className}`}>
      <div className='flex justify-between items-center mb-3'>
        <span className='text-sm font-medium text-zinc-300'>
          Chapitre {current} sur {total}
        </span>
        <span className='text-sm font-medium text-zinc-300'>{percentage}%</span>
      </div>
      <div className='w-full bg-zinc-800 rounded-full h-2'>
        <div
          className='bg-amber-600 h-2 rounded-full transition-all duration-300'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
