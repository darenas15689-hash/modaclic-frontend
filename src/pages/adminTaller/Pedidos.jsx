import { useEffect, useState } from 'react'
import api from '../../services/api'
import AutocompleteInput from '../../components/AutocompleteInput'

function PedidosAdminTaller() {
  const [pedidos, setPedidos] = useState([])
  const [nuevo, setNuevo] = useState({ cliente: '', total: 0, estado: 'pendiente' })
  const taller_id = 1

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const pedidosInvertidos = [...pedidos].reverse()
  const totalPages = Math.ceil(pedidosInvertidos.length / itemsPerPage)
  const currentItems = pedidosInvertidos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const clientes = [...new Set(pedidos.map(p => p.cliente))]

  const cargarPedidos = async () => {
    try { const res = await api.get(`/pedidos?taller_id=${taller_id}`); setPedidos(res.data) }
    catch (error){ console.error(error) }
  }

  useEffect(() => { cargarPedidos() }, [])

  const agregarPedido = async () => {
    if (!nuevo.cliente || !nuevo.total) return alert("Cliente y total requeridos")
    try { await api.post('/pedidos', { ...nuevo, taller_id }); setNuevo({ cliente: '', total: 0, estado: 'pendiente' }); setCurrentPage(1); cargarPedidos() }
    catch(error){ console.error(error) }
  }

  const cambiarEstado = async (id, estado) => {
    try { await api.put(`/pedidos/${id}`, { estado }); cargarPedidos() }
    catch(error){ console.error(error) }
  }

  const eliminarPedido = async (id) => {
    if(window.confirm("¿Eliminar pedido?")){
      try { await api.delete(`/pedidos/${id}`); cargarPedidos() }
      catch(error){ console.error(error) }
    }
  }

  return (
    <div>
      <h4>Pedidos del Taller</h4>
      <div className="card p-3 mb-3">
        <h6>Agregar Pedido</h6>
        <div className="d-flex gap-2 flex-wrap">
          <AutocompleteInput id="admin-pedidos-clientes" type="text" placeholder="Cliente" className="form-control"
                 options={clientes} value={nuevo.cliente} onChange={e => setNuevo({...nuevo, cliente: e.target.value})}/>
          <input type="number" placeholder="Total" className="form-control"
                 value={nuevo.total} onChange={e => setNuevo({...nuevo, total: e.target.value})}/>
          <button className="btn btn-success" onClick={agregarPedido}>Agregar Pedido</button>
        </div>
      </div>

      <table className="table table-dark table-hover">
        <thead><tr><th>Cliente</th><th>Total</th><th>Estado</th><th>Acción</th></tr></thead>
        <tbody>
          {currentItems.map(p => (
            <tr key={p.id}>
              <td>{p.cliente}</td>
              <td>${p.total}</td>
              <td>{p.estado}</td>
              <td className="d-flex gap-1">
                {p.estado === 'pendiente' && <button className="btn btn-sm btn-success" onClick={()=>cambiarEstado(p.id,'aprobado')}>Aprobar</button>}
                {p.estado === 'aprobado' && <button className="btn btn-sm btn-primary" onClick={()=>cambiarEstado(p.id,'completado')}>Completar</button>}
                <button className="btn btn-sm btn-danger" onClick={()=>eliminarPedido(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= PAGINACIÓN ================= */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-2 px-1">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ← Anterior
          </button>
          <span className="text-secondary small fw-semibold">
            Página {currentPage} de {totalPages} &nbsp;·&nbsp; {pedidos.length} registros
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}

export default PedidosAdminTaller
