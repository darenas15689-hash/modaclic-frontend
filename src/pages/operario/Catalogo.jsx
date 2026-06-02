import { useEffect, useState } from 'react'
import api from '../../services/api'

function CatalogoOperario() {
  const [productos, setProductos] = useState([])

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const productosInvertidos = [...productos].reverse()
  const totalPages = Math.ceil(productosInvertidos.length / itemsPerPage)
  const currentItems = productosInvertidos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  useEffect(() => {
    api.get('/productos?taller_id=1')
      .then(res => setProductos(res.data))
  }, [])

  return (
    <div>
      <h4>Catálogo</h4>

      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
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
            Página {currentPage} de {totalPages} &nbsp;·&nbsp; {productos.length} registros
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

export default CatalogoOperario
