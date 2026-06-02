import { useEffect, useState } from 'react'
import api from '../../services/api'
import AutocompleteInput from '../../components/AutocompleteInput'

// Mapeo de nombres de colores en español a códigos hex válidos
const colorNameMap = {
  'Negro': '#000000',
  'Blanco': '#FFFFFF',
  'Azul Navy': '#000080',
  'Azul': '#0000FF',
  'Rojo': '#FF0000',
  'Verde': '#00FF00',
  'Gris': '#808080',
  'Beige': '#F5F5DC',
  'Verde Militar': '#556B2F',
  'Café': '#8B4513',
  'Cafe': '#8B4513',
  'Amarillo': '#FFFF00',
  'Rosa': '#FFC0CB',
  'Rosado': '#FFC0CB',
  'Fucsia': '#FF00FF',
  'Magenta': '#FF00FF',
  'Cian': '#00FFFF',
  'Turquesa': '#008080',
  'Marrón': '#8B4513',
  'Marron': '#8B4513',
  'Vinotinto': '#800000'
}

const normalizeColor = (c) => {
  if (!c && c !== '') return ''
  const s = String(c || '').trim()
  // Si ya es un hex válido, devolver tal cual
  if (/^#([0-9A-F]{3}){1,2}$/i.test(s)) return s
  // Buscar coincidencia por nombre (insensible a mayúsculas)
  const normalizeName = value => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
  const found = Object.keys(colorNameMap).find(k => normalizeName(k) === normalizeName(s))
  if (found) return colorNameMap[found]
  // Devolver original como fallback
  return s
}

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

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  // ========================= ORDEN INVERTIDO + PAGINACIÓN =========================
  const pedidosInvertidos = [...pedidos].reverse()
  const totalPages = Math.ceil(pedidosInvertidos.length / itemsPerPage)
  const currentItems = pedidosInvertidos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
      setCurrentPage(1) // Volver a la primera página para ver el nuevo registro
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
      color: normalizeColor(pedido.color || '')
    })

    setEditandoId(pedido.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminarPedido = async (id) => {
    if (!window.confirm('¿Eliminar este pedido?')) return
    try {
      await api.delete(`/pedidos/${id}`)
      const newTotal = Math.ceil((pedidos.length - 1) / itemsPerPage)
      if (currentPage > newTotal && newTotal > 0) setCurrentPage(newTotal)
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
        <AutocompleteInput
          id="asesor-pedidos-clientes"
          className="form-control mb-2"
          placeholder="Cliente"
          options={clientes}
          value={nuevo.cliente}
          onChange={e => setNuevo({ ...nuevo, cliente: e.target.value })}
        />

        {/* 🔥 PRODUCTO AUTOCOMPLETE */}
        <AutocompleteInput
          id="asesor-pedidos-productos"
          className="form-control mb-2"
          placeholder="Producto"
          options={[...productosDisponibles, ...productosHistorial]}
          value={nuevo.producto}
          onChange={e => setNuevo({ ...nuevo, producto: e.target.value })}
        />

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
                  border: normalizeColor(nuevo.color) === c ? '3px solid #000' : '1px solid #ccc',
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
          {currentItems.map(p => (
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
                    backgroundColor: normalizeColor(p.color),
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

export default PedidosAsesor
