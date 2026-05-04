import { useEffect, useState } from 'react'
import api from '../../services/api'

const productosDisponibles = [
  'Saco Clásico', 'Saco Slim Fit', 'Saco Formal',
  'Pantalón Jeans', 'Pantalón Drill', 'Pantalón Formal',
  'Camisa Manga Larga', 'Camisa Manga Corta',
  'Chaqueta', 'Blazer', 'Vestido', 'Falda',
  'Overol', 'Sudadera', 'Hoodie', 'Camiseta',
  'Polo', 'Abrigo', 'Chaleco', 'Short'
]

const tiposPrenda = ['Masculina', 'Femenina']

const tallasDisponibles = [
  'XS','S','M','L','XL','XXL',
  '28','30','32','34','36','38',
  '40','42','44','Única'
]

const coloresDisponibles = [
  '#000000','#FFFFFF','#FF0000','#00FF00','#0000FF',
  '#FFFF00','#FF00FF','#00FFFF','#8B4513','#808080',
  '#800000','#008080','#000080'
]

function PedidosAsesor() {
  const [pedidos, setPedidos] = useState([])
  const [editandoId, setEditandoId] = useState(null)

  const [nuevo, setNuevo] = useState({
    cliente: '',
    producto: '',
    total: '',
    estado: 'Activo',
    tipo_prenda: '',
    talla: '',
    medidas_personalizadas: '',
    color: ''
  })

  // 🔥 AUTOCOMPLETADO (NUEVO)
  const clientes = [...new Set(pedidos.map(p => p.cliente))]
  const productosHistorial = [...new Set(pedidos.map(p => p.producto || p.producto_interesado || p.tipo_producto))]

  const taller_id = 1

  const cargarPedidos = async () => {
    try {
      const res = await api.get(`/pedidos?taller_id=${taller_id}`)
      setPedidos(res.data)
    } catch (error) {
      console.error('Error cargando pedidos:', error.response?.data)
    }
  }

  useEffect(() => {
    cargarPedidos()
  }, [])

  const crearOActualizarPedido = async () => {
    if (!nuevo.cliente || !nuevo.producto || !nuevo.total) {
      alert('Todos los campos son obligatorios')
      return
    }

    try {
      if (editandoId) {
        await api.put(`/pedidos/${editandoId}`, {
          ...nuevo,
          total: Number(nuevo.total)
        })
      } else {
        await api.post('/pedidos', {
          ...nuevo,
          total: Number(nuevo.total),
          taller_id
        })
      }

      setNuevo({
        cliente: '',
        producto: '',
        total: '',
        estado: 'Activo',
        tipo_prenda: '',
        talla: '',
        medidas_personalizadas: '',
        color: ''
      })

      setEditandoId(null)
      cargarPedidos()
    } catch (error) {
      console.error('Error guardando pedido:', error.response?.data)
    }
  }

  const editarPedido = (pedido) => {
    setNuevo({
      cliente: pedido.cliente,
      producto: pedido.producto || pedido.producto_interesado || pedido.tipo_producto || '',
      total: pedido.total,
      estado: pedido.estado,
      tipo_prenda: pedido.tipo_prenda || '',
      talla: pedido.talla || '',
      medidas_personalizadas: pedido.medidas_personalizadas || '',
      color: pedido.color || ''
    })

    setEditandoId(pedido.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminarPedido = async (id) => {
    if (!window.confirm('¿Eliminar este pedido?')) return
    try {
      await api.delete(`/pedidos/${id}`)
      cargarPedidos()
    } catch (error) {
      console.error('Error eliminando pedido:', error.response?.data)
    }
  }

  return (
    <div>
      <h4>Pedidos / Cotizaciones</h4>

      <div className="card p-3 mb-3">
        <h6>{editandoId ? 'Editar Pedido' : 'Nuevo Pedido'}</h6>

        {/* 🔥 CLIENTE AUTOCOMPLETE */}
        <input
          className="form-control mb-2"
          placeholder="Cliente"
          list="clientes"
          value={nuevo.cliente}
          onChange={e => setNuevo({ ...nuevo, cliente: e.target.value })}
        />
        <datalist id="clientes">
          {clientes.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>

        {/* 🔥 PRODUCTO AUTOCOMPLETE */}
        <input
          className="form-control mb-2"
          placeholder="Producto"
          list="productos"
          value={nuevo.producto}
          onChange={e => setNuevo({ ...nuevo, producto: e.target.value })}
        />
        <datalist id="productos">
          {[...productosDisponibles, ...productosHistorial].map((p, i) => (
            <option key={i} value={p} />
          ))}
        </datalist>

        <select
          className="form-select mb-2"
          value={nuevo.tipo_prenda}
          onChange={e => setNuevo({ ...nuevo, tipo_prenda: e.target.value })}
        >
          <option value="">Tipo de prenda</option>
          {tiposPrenda.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>

        <select
          className="form-select mb-2"
          value={nuevo.talla}
          onChange={e => setNuevo({ ...nuevo, talla: e.target.value })}
        >
          <option value="">Seleccione talla</option>
          {tallasDisponibles.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </select>

        <textarea
          className="form-control mb-2"
          placeholder="Medidas personalizadas"
          value={nuevo.medidas_personalizadas}
          onChange={e => setNuevo({ ...nuevo, medidas_personalizadas: e.target.value })}
        />

        <div className="mb-2">
          <label className="form-label">Color</label>
          <div className="d-flex flex-wrap gap-2">
            {coloresDisponibles.map((c, i) => (
              <div
                key={i}
                onClick={() => setNuevo({ ...nuevo, color: c })}
                style={{
                  width: 26,
                  height: 26,
                  backgroundColor: c,
                  border: nuevo.color === c ? '3px solid #000' : '1px solid #ccc',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Total"
          value={nuevo.total}
          onChange={e => setNuevo({ ...nuevo, total: e.target.value })}
        />

        <select
          className="form-select mb-2"
          value={nuevo.estado}
          onChange={e => setNuevo({ ...nuevo, estado: e.target.value })}
        >
          <option value="Activo">Activo</option>
          <option value="En proceso">En proceso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <button
          className={`btn ${editandoId ? 'btn-primary' : 'btn-success'}`}
          onClick={crearOActualizarPedido}
        >
          {editandoId ? 'Actualizar Pedido' : 'Crear Pedido'}
        </button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {pedidos.map(p => (
            <tr key={p.id}>
              <td>{p.cliente}</td>
              <td>{p.producto || p.producto_interesado || p.tipo_producto}</td>
              <td>{p.tipo_prenda}</td>
              <td>{p.talla}</td>
              <td>
                {p.color && (
                  <div style={{
                    width: 18,
                    height: 18,
                    backgroundColor: p.color,
                    border: '1px solid #000'
                  }} />
                )}
              </td>
              <td>{p.estado}</td>
              <td>${p.total}</td>
              <td className="d-flex gap-1">
                <button className="btn btn-sm btn-primary" onClick={() => editarPedido(p)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => eliminarPedido(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PedidosAsesor