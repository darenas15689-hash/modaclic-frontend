import axios from 'axios'
import { useEffect, useState } from 'react'

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
      await axios.post('http://127.0.0.1:5000/api/produccion', form)
      alert('Orden creada correctamente')
      cargarOrdenes()
    } catch (error) {
      console.error(error)
      alert('Error al crear la orden')
    }
  }

  /* ===== LISTADO DE ÓRDENES ===== */
  const [ordenes, setOrdenes] = useState([])

  // 🔥 AUTOCOMPLETADO (NUEVO)
  const pedidosIds = [...new Set(ordenes.map(o => o.pedido_id))]
  const productos = [...new Set(ordenes.map(o => o.producto))]
  const responsables = [...new Set(ordenes.map(o => o.responsable))]

  const cargarOrdenes = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/produccion')
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
      await axios.put(
        `http://127.0.0.1:5000/api/produccion/${orden.id}`,
        { responsable }
      )
      cargarOrdenes()
    } catch (error) {
      console.error(error)
    }
  }

  const eliminarOrden = async (id) => {
    if (!window.confirm('¿Eliminar orden de producción?')) return

    try {
      await axios.delete(`http://127.0.0.1:5000/api/produccion/${id}`)
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
      <input
        className="form-control mb-2"
        name="pedido_id"
        placeholder="ID Pedido"
        list="pedidos"
        onChange={handleChange}
      />
      <datalist id="pedidos">
        {pedidosIds.map((p, i) => (
          <option key={i} value={p} />
        ))}
      </datalist>

      {/* 🔥 AUTOCOMPLETE PRODUCTO */}
      <input
        className="form-control mb-2"
        name="producto"
        placeholder="Producto"
        list="productos"
        onChange={handleChange}
      />
      <datalist id="productos">
        {productos.map((p, i) => (
          <option key={i} value={p} />
        ))}
      </datalist>

      <input
        className="form-control mb-2"
        name="cantidad"
        placeholder="Cantidad"
        onChange={handleChange}
      />

      {/* 🔥 AUTOCOMPLETE RESPONSABLE */}
      <input
        className="form-control mb-2"
        name="responsable"
        placeholder="ID Operario"
        list="responsables"
        onChange={handleChange}
      />
      <datalist id="responsables">
        {responsables.map((r, i) => (
          <option key={i} value={r} />
        ))}
      </datalist>

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
          {ordenes.map(o => (
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

    </div>
  )
}

export default ProduccionAdminTaller