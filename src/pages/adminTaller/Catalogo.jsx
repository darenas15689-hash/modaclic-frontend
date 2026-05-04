import { useEffect, useState } from 'react'
import api from '../../services/api'

function CatalogoAdminTaller() {
  const [productos, setProductos] = useState([])
  const [nuevo, setNuevo] = useState({ nombre: '', precio: '', categoria_id: 1, activo: true })
  const [editando, setEditando] = useState(null)
  const taller_id = 1

  const cargarProductos = async () => {
    try {
      const res = await api.get(`/productos?taller_id=${taller_id}`)
      setProductos(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => { cargarProductos() }, [])

  const agregarProducto = async () => {
    if (!nuevo.nombre || !nuevo.precio) return alert("Nombre y precio requeridos")
    try {
      await api.post('/productos', { ...nuevo, taller_id })
      setNuevo({ nombre: '', precio: '', categoria_id: 1, activo: true })
      cargarProductos()
    } catch (error) { console.error(error) }
  }

  const actualizarProducto = async () => {
    try {
      await api.put(`/productos/${editando.id}`, editando)
      setEditando(null)
      cargarProductos()
    } catch (error) { console.error(error) }
  }

  const eliminarProducto = async (id) => {
    if(window.confirm("¿Eliminar producto?")){
      try { await api.delete(`/productos/${id}`); cargarProductos() }
      catch (error){ console.error(error) }
    }
  }

  const toggleActivo = async (id, actual) => {
    try { await api.put(`/productos/${id}`, { activo: !actual }); cargarProductos() }
    catch(error){ console.error(error) }
  }

  const editarProducto = (producto) => setEditando(producto)

  return (
    <div>
      <h4>Catálogo del Taller</h4>
      <div className="card p-3 mb-3">
        <h6>{editando ? "Editar Producto" : "Agregar Producto"}</h6>
        <div className="d-flex gap-2 flex-wrap">
          <input type="text" className="form-control" placeholder="Nombre"
                 value={editando ? editando.nombre : nuevo.nombre}
                 onChange={e => editando ? setEditando({ ...editando, nombre: e.target.value })
                                          : setNuevo({ ...nuevo, nombre: e.target.value })}/>
          <input type="number" className="form-control" placeholder="Precio"
                 value={editando ? editando.precio : nuevo.precio}
                 onChange={e => editando ? setEditando({ ...editando, precio: e.target.value })
                                          : setNuevo({ ...nuevo, precio: e.target.value })}/>
          {editando
            ? <button className="btn btn-primary" onClick={actualizarProducto}>Actualizar</button>
            : <button className="btn btn-success" onClick={agregarProducto}>Agregar</button>}
        </div>
      </div>

      <table className="table table-dark table-hover">
        <thead>
          <tr><th>Producto</th><th>Precio</th><th>Estado</th><th>Acción</th></tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>{p.activo ? 'Activo' : 'Inactivo'}</td>
              <td className="d-flex gap-1">
                <button className="btn btn-sm btn-warning" onClick={() => editarProducto(p)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                <button className="btn btn-sm btn-secondary" onClick={() => toggleActivo(p.id, p.activo)}>
                  {p.activo ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CatalogoAdminTaller
