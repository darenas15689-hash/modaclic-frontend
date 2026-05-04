import { Link, useLocation } from 'react-router-dom'

function SidebarOperario() {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path ? 'active fw-bold' : ''

  return (
    <div className="col-2 min-vh-100 bg-dark text-white p-3 border-end">
      <h5 className="text-center mb-4">ModaClic</h5>

      <ul className="nav nav-pills flex-column gap-2">
        <li className="nav-item">
          <Link
            to="/operario/dashboard"
            className={`nav-link text-white ${isActive('/operario/dashboard')}`}
          >
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/operario/catalogo"
            className={`nav-link text-white ${isActive('/operario/catalogo')}`}
          >
            Catálogo
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/operario/produccion"
            className={`nav-link text-white ${isActive('/operario/produccion')}`}
          >
            Producción
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SidebarOperario
