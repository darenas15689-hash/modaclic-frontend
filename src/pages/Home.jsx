import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-5 shadow-lg" style={{ width: '420px' }}>
        <h3 className="text-center mb-4">ModaClic</h3>
        <p className="text-center mb-4">
          Selecciona el rol con el que deseas ingresar
        </p>

        <div className="d-grid gap-3">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/admin-taller/dashboard')}
          >
            Administrador de Taller
          </button>

          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate('/operario/dashboard')}
          >
            Operario
          </button>

          <button
            className="btn btn-outline-primary btn-lg"
            onClick={() => navigate('/asesor/dashboard')}
          >
            Asesor
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
