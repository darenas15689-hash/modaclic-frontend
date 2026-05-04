import { useEffect, useState } from 'react'
import api from '../../services/api'

function ProduccionOperario() {
  const [ordenes, setOrdenes] = useState([])
  const taller_id = 1

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
          {ordenes.map(o => (
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
    </div>
  )
}

export default ProduccionOperario
