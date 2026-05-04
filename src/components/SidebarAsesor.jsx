import { Link } from 'react-router-dom'

function SidebarAsesor() {
  return (
    <div className="col-2 min-vh-100 sidebar p-3">
      <h5 className="text-white mb-4">Asesor</h5>

      <ul className="nav flex-column gap-2">
        <li>
          <Link className="nav-link text-white" to="/asesor/dashboard">
            Dashboard
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/asesor/citas">
            Citas
          </Link>
        </li>

        <li>
          <Link className="nav-link text-white" to="/asesor/pedidos">
            Pedidos
          </Link>
        </li>

        {/* 🔹 NUEVO: PRE-PEDIDOS / COTIZACIONES */}
        <li>
          <Link className="nav-link text-white" to="/asesor/cotizaciones">
            Pre-Pedidos / Cotizaciones
          </Link>
        </li>

        {/* 🔹 NUEVO: CALCULADORA DE PRECIOS */}
        <li>
          <Link className="nav-link text-white" to="/asesor/calculadora">
            Calculadora de Precios
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default SidebarAsesor
