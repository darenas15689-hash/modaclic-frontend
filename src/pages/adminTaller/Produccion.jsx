import { useEffect, useState } from 'react'
import AutocompleteInput from '../../components/AutocompleteInput'
import api from '../../services/api'

function ProduccionAdminTaller() {

  /* ===== FORMULARIO (NO SE MODIFICA) ===== */
  const [form, setForm] = useState({
    pedido_id: '',
    producto: '',
    cantidad: '',
    responsable: '',
    fecha_estimada: '',
    taller_id: 1
  })

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const agregarOrden = async () => {
    try {
      await api.post('/produccion', form)
      alert('Orden creada correctamente')
      setCurrentPage(1)
      cargarOrdenes()
    } catch (error) {
      console.error(error)
      alert('Error al crear la orden')
    }
  }

  /* ===== LISTADO DE ÓRDENES ===== */
  const [ordenes, setOrdenes] = useState([])

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const ordenesInvertidas = [...ordenes].reverse()
  const totalPages = Math.ceil(ordenesInvertidas.length / itemsPerPage)
  const currentItems = ordenesInvertidas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // 🔥 AUTOCOMPLETADO (NUEVO)
  const pedidosIds = [...new Set(ordenes.map(o => o.pedido_id))]
  const productos = [...new Set(ordenes.map(o => o.producto))]
  const responsables = [...new Set(ordenes.map(o => o.responsable))]

  const cargarOrdenes = async () => {
    try {
      const res = await api.get('/produccion')
      setOrdenes(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const asignarResponsable = async (orden) => {
    const responsable = prompt(
      'Responsable:',
      orden.responsable || ''
    )
    if (!responsable) return

    try {
      await api.put(`/produccion/${orden.id}`, { responsable })
      cargarOrdenes()
    } catch (error) {
      console.error(error)
    }
  }

  const eliminarOrden = async (id) => {
    if (!window.confirm('¿Eliminar orden de producción?')) return

    try {
      await api.delete(`/produccion/${id}`)
      cargarOrdenes()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>

      {/* ===== FORMULARIO ===== */}
      <h4 className="mb-3">Nueva Orden de Producción</h4>

      {/* 🔥 AUTOCOMPLETE PEDIDO ID */}
      <AutocompleteInput
        id="admin-produccion-pedidos"
        className="form-control mb-2"
        name="pedido_id"
        placeholder="ID Pedido"
        options={pedidosIds}
        value={form.pedido_id}
        onChange={handleChange}
      />

      {/* 🔥 AUTOCOMPLETE PRODUCTO */}
      <AutocompleteInput
        id="admin-produccion-productos"
        className="form-control mb-2"
        name="producto"
        placeholder="Producto"
        options={productos}
        value={form.producto}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        name="cantidad"
        placeholder="Cantidad"
        onChange={handleChange}
      />

      {/* 🔥 AUTOCOMPLETE RESPONSABLE */}
      <AutocompleteInput
        id="admin-produccion-responsables"
        className="form-control mb-2"
        name="responsable"
        placeholder="ID Operario"
        options={responsables}
        value={form.responsable}
        onChange={handleChange}
      />

      <input
        className="form-control mb-2"
        type="date"
        name="fecha_estimada"
        onChange={handleChange}
      />

      <button className="btn btn-primary mt-2 mb-4" onClick={agregarOrden}>
        Agregar Orden
      </button>

      {/* ===== TABLA ===== */}
      <h5>Órdenes de Producción</h5>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Pedido</th>
            <th>Estado</th>
            <th>Responsable</th>
            <th>Fecha Estimada</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(o => (
            <tr key={o.id}>
              <td>{o.pedido_id}</td>
              <td>{o.estado}</td>
              <td>{o.responsable || '-'}</td>
              <td>{o.fecha_estimada}</td>
              <td className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => asignarResponsable(o)}
                >
                  Asignar
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
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

export default ProduccionAdminTaller
