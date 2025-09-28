import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const startLearning = () => {
    navigate('/story/01-introduction/chapter/01-what-is-chess')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #3730a3 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem 2rem',
      textAlign: 'center'
    }}>
      
      {/* Chess Icon */}
      <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>♟️</div>
      
      {/* Title */}
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '2rem',
        maxWidth: '1200px'
      }}>
        Apprends les Échecs
      </h1>
      
      {/* Description */}
      <p style={{
        fontSize: '1.5rem',
        color: '#e2e8f0',
        lineHeight: '1.6',
        maxWidth: '800px',
        marginBottom: '4rem'
      }}>
        Découvre le monde fascinant des échecs à travers des histoires captivantes. 
        Apprends les règles, maîtrise les stratégies et deviens un véritable champion !
      </p>

      {/* Big Button */}
      <button
        onClick={startLearning}
        style={{
          backgroundColor: '#f97316',
          color: 'white',
          fontSize: '2rem',
          fontWeight: 'bold',
          padding: '2rem 4rem',
          borderRadius: '1rem',
          border: '4px solid #fed7aa',
          cursor: 'pointer',
          marginBottom: '4rem',
          transform: 'scale(1)',
          transition: 'all 0.3s ease',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)'
          e.target.style.backgroundColor = '#ea580c'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)'
          e.target.style.backgroundColor = '#f97316'
        }}
      >
        🚀 COMMENCER L'AVENTURE 🚀
      </button>

      {/* Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem',
        maxWidth: '1200px',
        width: '100%'
      }}>
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          padding: '3rem',
          borderRadius: '1rem',
          border: '1px solid #475569',
          backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            📚 Histoires
          </h3>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1.1rem'
          }}>
            Apprends avec des récits captivants
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          padding: '3rem',
          borderRadius: '1rem',
          border: '1px solid #475569',
          backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            ♟️ Échiquier
          </h3>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1.1rem'
          }}>
            Pratique sur un vrai échiquier
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          padding: '3rem',
          borderRadius: '1rem',
          border: '1px solid #475569',
          backdropFilter: 'blur(8px)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            🎯 Exercices
          </h3>
          <p style={{
            color: '#cbd5e1',
            fontSize: '1.1rem'
          }}>
            Teste tes connaissances
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage