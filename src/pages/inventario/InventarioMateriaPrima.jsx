import { useEffect, useState } from 'react'

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
        <input
          className="form-control mb-2"
          placeholder="Nombre"
          list="nombresMateria"
          value={nuevo.nombre}
          onChange={e=>setNuevo({...nuevo,nombre:e.target.value})}
        />
        <datalist id="nombresMateria">
          {nombresMateria.map((n,i)=>(
            <option key={i} value={n}/>
          ))}
        </datalist>

        {/* 🔹 UNIDAD */}
        <input
          className="form-control mb-2"
          placeholder="Unidad (m, kg, rollos)"
          list="unidadesDisponibles"
          value={nuevo.unidad}
          onChange={e=>setNuevo({...nuevo,unidad:e.target.value})}
        />
        <datalist id="unidadesDisponibles">
          {unidadesDisponibles.map((u,i)=>(
            <option key={i} value={u}/>
          ))}
        </datalist>

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
          {items.map(i=>(
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
    </div>
  )
}

export default InventarioMateriaPrima