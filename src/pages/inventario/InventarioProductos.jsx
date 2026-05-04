import { useEffect, useState } from 'react'
import api from '../../services/api'

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
        <input
          className="form-control mb-2"
          placeholder="Nombre"
          list="nombresProductos"
          value={nuevo.nombre}
          onChange={e=>setNuevo({...nuevo,nombre:e.target.value})}
        />
        <datalist id="nombresProductos">
          {nombresProductos.map((n,i)=>(
            <option key={i} value={n}/>
          ))}
        </datalist>

        {/* 🔹 TIPO */}
        <input
          className="form-control mb-2"
          placeholder="Tipo"
          list="tiposProductos"
          value={nuevo.tipo}
          onChange={e=>setNuevo({...nuevo,tipo:e.target.value})}
        />
        <datalist id="tiposProductos">
          {tiposProductos.map((t,i)=>(
            <option key={i} value={t}/>
          ))}
        </datalist>

        {/* 🔹 TALLA */}
        <input
          className="form-control mb-2"
          placeholder="Talla"
          list="tallasDisponibles"
          value={nuevo.talla}
          onChange={e=>setNuevo({...nuevo,talla:e.target.value})}
        />
        <datalist id="tallasDisponibles">
          {tallasDisponibles.map((t,i)=>(
            <option key={i} value={t}/>
          ))}
        </datalist>

        {/* 🔹 COLOR */}
        <input
          className="form-control mb-2"
          placeholder="Color"
          list="coloresDisponibles"
          value={nuevo.color}
          onChange={e=>setNuevo({...nuevo,color:e.target.value})}
        />
        <datalist id="coloresDisponibles">
          {coloresDisponibles.map((c,i)=>(
            <option key={i} value={c}/>
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
            <th>Nombre</th><th>Tipo</th><th>Talla</th><th>Color</th><th>Stock</th><th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p=>(
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
    </div>
  )
}

export default InventarioProductos