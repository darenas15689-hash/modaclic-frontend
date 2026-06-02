import { useEffect, useState } from 'react'
import AutocompleteInput from '../../components/AutocompleteInput'

/* 🔹 AUTOCOMPLETADO (NUEVO) */
const nombresMateria = [
  'Algodón','Poliéster','Lana','Seda','Denim','Lino','Cuero',
  'Hilo','Botones','Cremallera','Elástico','Encaje'
]

const unidadesDisponibles = [
  'm','kg','rollos','unidades','pares','litros'
]

function InventarioMateriaPrima() {
  const [items, setItems] = useState([])
  const [editandoId, setEditandoId] = useState(null)

  const [nuevo, setNuevo] = useState({
    nombre: '',
    unidad: '',
    stock: ''
  })

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const itemsInvertidos = [...items].reverse()
  const totalPages = Math.ceil(itemsInvertidos.length / itemsPerPage)
  const currentItems = itemsInvertidos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const nombresHistorial = [...new Set(items.map(i => i.nombre))]
  const unidadesHistorial = [...new Set(items.map(i => i.unidad))]

  const cargar = async () => {
    const res = await fetch('http://localhost:5000/api/inventario/materia-prima')
    setItems(await res.json())
  }

  useEffect(()=>{ cargar() },[])

  const guardar = async () => {
    if (!nuevo.nombre || !nuevo.stock) return alert('Campos obligatorios')

    const url = editandoId
      ? `http://localhost:5000/api/inventario/materia-prima/${editandoId}`
      : 'http://localhost:5000/api/inventario/materia-prima'

    await fetch(url,{
      method: editandoId ? 'PUT' : 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(nuevo)
    })

    setNuevo({nombre:'',unidad:'',stock:''})
    setEditandoId(null)
    setCurrentPage(1)
    cargar()
  }

  const editar = (i) => {
    setNuevo(i)
    setEditandoId(i.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar materia prima?')) return
    await fetch(`http://localhost:5000/api/inventario/materia-prima/${id}`,{
      method:'DELETE'
    })
    cargar()
  }

  return (
    <div>
      <h4>Inventario Materia Prima</h4>

      <div className="card p-3 mb-3">

        {/* 🔹 NOMBRE */}
        <AutocompleteInput
          id="inventario-materia-nombres"
          className="form-control mb-2"
          placeholder="Nombre"
          options={[...nombresMateria, ...nombresHistorial]}
          value={nuevo.nombre}
          onChange={e=>setNuevo({...nuevo,nombre:e.target.value})}
        />

        {/* 🔹 UNIDAD */}
        <AutocompleteInput
          id="inventario-materia-unidades"
          className="form-control mb-2"
          placeholder="Unidad (m, kg, rollos)"
          options={[...unidadesDisponibles, ...unidadesHistorial]}
          value={nuevo.unidad}
          onChange={e=>setNuevo({...nuevo,unidad:e.target.value})}
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
            <th>Nombre</th><th>Unidad</th><th>Stock</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map(i=>(
            <tr key={i.id}>
              <td>{i.nombre}</td>
              <td>{i.unidad}</td>
              <td>{i.stock}</td>
              <td className="d-flex gap-1">
                <button className="btn btn-sm btn-primary" onClick={()=>editar(i)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={()=>eliminar(i.id)}>Eliminar</button>
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
            Página {currentPage} de {totalPages} &nbsp;·&nbsp; {items.length} registros
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

export default InventarioMateriaPrima
