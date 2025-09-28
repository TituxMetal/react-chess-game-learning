interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

const ProgressBar = ({ current, total, className = '' }: ProgressBarProps) => {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-dark-300">
          Chapitre {current} sur {total}
        </span>
        <span className="text-sm font-medium text-dark-300">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-dark-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar