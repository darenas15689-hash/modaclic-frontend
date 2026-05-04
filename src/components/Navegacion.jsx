import { Link } from 'react-router-dom'

function Navegacion() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold">
          ModaClic
        </Link>

        <div className="d-flex gap-2">
          <Link to="/admin-general" className="btn btn-outline-light btn-sm">
            Admin General
          </Link>

          <Link to="/admin-taller" className="btn btn-outline-light btn-sm">
            Admin Taller
          </Link>

          <Link to="/operario" className="btn btn-outline-light btn-sm">
            Operario
          </Link>

          <Link to="/asesor" className="btn btn-outline-light btn-sm">
            Asesor
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navegacion
