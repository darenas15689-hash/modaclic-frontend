import { useEffect, useState } from 'react'
import api from '../../services/api'

function ProduccionOperario() {
  const [ordenes, setOrdenes] = useState([])
  const taller_id = 1

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const ordenesInvertidas = [...ordenes].reverse()
  const totalPages = Math.ceil(ordenesInvertidas.length / itemsPerPage)
  const currentItems = ordenesInvertidas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const cargarOrdenes = () => {
    api.get(`/produccion?taller_id=${taller_id}`)
      .then(res => setOrdenes(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cambiarEstado = (id, estado) => {
    api.put(`/produccion/${id}`, { estado })
      .then(() => cargarOrdenes())
      .catch(err => console.error(err))
  }

  const eliminarOrden = (id) => {
    if (!window.confirm('¿Eliminar esta orden de producción?')) return

    api.delete(`/produccion/${id}`)
      .then(() => cargarOrdenes())
      .catch(err => console.error(err))
  }

  return (
    <div>
      <h4>Producción</h4>

      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map(o => (
            <tr key={o.id}>
              <td>{o.pedido_id}</td>
              <td>{o.estado}</td>
              <td className="d-flex gap-1 flex-wrap">

                {/* Cambiar estado */}
                <select
                  className="form-select form-select-sm"
                  value={o.estado}
                  onChange={e => cambiarEstado(o.id, e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En proceso</option>
                  <option value="Finalizado">Finalizado</option>
                </select>

                {/* Eliminar */}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarOrden(o.id)}
                >
                  Eliminar
                </button>

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
            Página {currentPage} de {totalPages} &nbsp;·&nbsp; {ordenes.length} registros
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

export default ProduccionOperario
