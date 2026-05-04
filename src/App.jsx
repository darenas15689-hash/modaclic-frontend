import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import SidebarOperario from './components/SidebarOperario'
import SidebarAsesor from './components/SidebarAsesor' // ✅ ASESOR
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from './pages/Home'

import DashboardAdminTaller from './pages/adminTaller/Dashboard'
import CatalogoAdminTaller from './pages/adminTaller/Catalogo'
import PedidosAdminTaller from './pages/adminTaller/Pedidos'
import ProduccionAdminTaller from './pages/adminTaller/Produccion'
import CitasAdminTaller from './pages/adminTaller/Citas'

import DashboardOperario from './pages/operario/Dashboard'
import CatalogoOperario from './pages/operario/Catalogo'
import ProduccionOperario from './pages/operario/Produccion'

// ✅ ASESOR
import DashboardAsesor from './pages/asesor/Dashboard'
import CitasAsesor from './pages/asesor/Citas'
import PedidosAsesor from './pages/asesor/Pedidos'

// ✅ NUEVO ASESOR
import Cotizaciones from './pages/asesor/Cotizaciones'
import CalculadoraPrecio from './pages/asesor/CalculadoraPrecio'

// ✅ INVENTARIO
import InventarioProductos from './pages/inventario/InventarioProductos'
import InventarioMateriaPrima from './pages/inventario/InventarioMateriaPrima'


function Layout() {
  const location = useLocation()

  const esOperario = location.pathname.startsWith('/operario')
  const esAdminTaller = location.pathname.startsWith('/admin-taller')
  const esAsesor = location.pathname.startsWith('/asesor')
  const esHome = location.pathname === '/'

  return (
    <div className="row g-0">
      {!esHome && (
        esOperario ? (
          <SidebarOperario />
        ) : esAsesor ? (
          <SidebarAsesor />
        ) : esAdminTaller ? (
          <Sidebar rol="Administrador Taller" />
        ) : null
      )}

      <div className="col p-4">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Admin Taller */}
          <Route path="/admin-taller/dashboard" element={<DashboardAdminTaller />} />
          <Route path="/admin-taller/catalogo" element={<CatalogoAdminTaller />} />
          <Route path="/admin-taller/pedidos" element={<PedidosAdminTaller />} />
          <Route path="/admin-taller/produccion" element={<ProduccionAdminTaller />} />
          <Route path="/admin-taller/citas" element={<CitasAdminTaller />} />

          {/* Operario */}
          <Route path="/operario/dashboard" element={<DashboardOperario />} />
          <Route path="/operario/catalogo" element={<CatalogoOperario />} />
          <Route path="/operario/produccion" element={<ProduccionOperario />} />

          {/* ✅ ASESOR */}
          <Route path="/asesor/dashboard" element={<DashboardAsesor />} />
          <Route path="/asesor/citas" element={<CitasAsesor />} />
          <Route path="/asesor/pedidos" element={<PedidosAsesor />} />

          {/* ✅ NUEVAS RUTAS ASESOR */}
          <Route path="/asesor/cotizaciones" element={<Cotizaciones />} />
          <Route path="/asesor/calculadora" element={<CalculadoraPrecio />} />

          {/* Inventario */}
          <Route path="/inventario/productos" element={<InventarioProductos />} />
          <Route path="/inventario/materia-prima" element={<InventarioMateriaPrima />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 RUTAS PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 RUTAS PRIVADAS (con layout) */}
        <Route path="/*" element={<Layout />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
