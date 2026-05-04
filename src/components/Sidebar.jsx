import { Link } from 'react-router-dom'

function Sidebar({ rol }) {
  return (
    <div className="col-2 bg-black min-vh-100 p-3 border-end">
      <h6 className="text-secondary mb-4">Panel {rol}</h6>

      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <Link to="/admin-taller/dashboard" className="nav-link text-light">Dashboard</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-taller/catalogo" className="nav-link text-light">Catálogo</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-taller/pedidos" className="nav-link text-light">Pedidos</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-taller/produccion" className="nav-link text-light">Producción</Link>
        </li>
        <li className="nav-item">
          <Link to="/admin-taller/citas" className="nav-link text-light">Citas</Link>
        </li>

        {/* 🔽 NUEVO — INVENTARIO */}
        <li className="nav-item mt-3">
          <span className="text-secondary small">Inventario</span>
        </li>

        <li className="nav-item">
          <Link to="/inventario/productos" className="nav-link text-light">
            Inventario Productos
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/inventario/materia-prima" className="nav-link text-light">
            Inventario Materia Prima
          </Link>
        </li>
        {/* 🔼 FIN INVENTARIO */}
      </ul>
    </div>
  )
}

export default Sidebar
