import { useEffect, useState } from 'react'
import api from '../../services/api'
import AutocompleteInput from '../../components/AutocompleteInput'

/* 🔹 AUTOCOMPLETADO (NUEVO) */
const nombresProductos = [
  'Saco Clásico','Saco Slim Fit','Pantalón Jeans','Camisa','Vestido','Falda','Chaqueta'
]

const tiposProductos = [
  'Masculino','Femenino','Unisex'
]

const tallasDisponibles = [
  'XS','S','M','L','XL','XXL','28','30','32','34','36','38','40'
]

const coloresDisponibles = [
  'Negro','Blanco','Rojo','Azul','Verde','Gris','Beige','Amarillo'
]

function InventarioProductos() {
  const [productos, setProductos] = useState([])
  const [editandoId, setEditandoId] = useState(null)

  const [nuevo, setNuevo] = useState({
    nombre: '',
    tipo: '',
    talla: '',
    color: '',
    stock: ''
  })

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const productosInvertidos = [...productos].reverse()
  const totalPages = Math.ceil(productosInvertidos.length / itemsPerPage)
  const currentItems = productosInvertidos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const nombresHistorial = [...new Set(productos.map(p => p.nombre))]
  const tiposHistorial = [...new Set(productos.map(p => p.tipo))]
  const tallasHistorial = [...new Set(productos.map(p => p.talla))]
  const coloresHistorial = [...new Set(productos.map(p => p.color))]

  const cargar = async () => {
    const res = await fetch('http://localhost:5000/api/inventario/productos')
    setProductos(await res.json())
  }

  useEffect(() => { cargar() }, [])

  const guardar = async () => {
    if (!nuevo.nombre || !nuevo.stock) return alert('Campos obligatorios')

    if (editandoId) {
      await fetch(`http://localhost:5000/api/inventario/productos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      })
    } else {
      await fetch('http://localhost:5000/api/inventario/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      })
    }

    setNuevo({ nombre:'', tipo:'', talla:'', color:'', stock:'' })
    setEditandoId(null)
    setCurrentPage(1)
    cargar()
  }

  const editar = (p) => {
    setNuevo(p)
    setEditandoId(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar producto?')) return
    await fetch(`http://localhost:5000/api/inventario/productos/${id}`, {
      method: 'DELETE'
    })
    cargar()
  }

  return (
    <div>
      <h4>Inventario de Productos</h4>

      <div className="card p-3 mb-3">

        {/* 🔹 NOMBRE */}
        <AutocompleteInput
          id="inventario-productos-nombres"
          className="form-control mb-2"
          placeholder="Nombre"
          options={[...nombresProductos, ...nombresHistorial]}
          value={nuevo.nombre}
          onChange={e=>setNuevo({...nuevo,nombre:e.target.value})}
        />

        {/* 🔹 TIPO */}
        <AutocompleteInput
          id="inventario-productos-tipos"
          className="form-control mb-2"
          placeholder="Tipo"
          options={[...tiposProductos, ...tiposHistorial]}
          value={nuevo.tipo}
          onChange={e=>setNuevo({...nuevo,tipo:e.target.value})}
        />

        {/* 🔹 TALLA */}
        <AutocompleteInput
          id="inventario-productos-tallas"
          className="form-control mb-2"
          placeholder="Talla"
          options={[...tallasDisponibles, ...tallasHistorial]}
          value={nuevo.talla}
          onChange={e=>setNuevo({...nuevo,talla:e.target.value})}
        />

        {/* 🔹 COLOR */}
        <AutocompleteInput
          id="inventario-productos-colores"
          className="form-control mb-2"
          placeholder="Color"
          options={[...coloresDisponibles, ...coloresHistorial]}
          value={nuevo.color}
          onChange={e=>setNuevo({...nuevo,color:e.target.value})}
        />

        {/* 🔹 STOCK */}
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Stock"
          value={nuevo.stock}
          onChange={e=>setNuevo({...nuevo,stock:e.target.value})}
        />

        <button className={`btn ${editandoId?'btn-primary':'btn-success'}`} onClick={guardar}>
          {editandoId ? 'Actualizar' : 'Agregar'}
        </button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Nombre</th><th>Tipo</th><th>Talla</th><th>Color</th><th>Stock</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(p=>(
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.tipo}</td>
              <td>{p.talla}</td>
              <td>{p.color}</td>
              <td>{p.stock}</td>
              <td className="d-flex gap-1">
                <button className="btn btn-sm btn-primary" onClick={()=>editar(p)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={()=>eliminar(p.id)}>Eliminar</button>
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

export default InventarioProductos
