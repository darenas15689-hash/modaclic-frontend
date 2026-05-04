import { useEffect, useState } from 'react'
import api from '../../services/api'

function CatalogoOperario() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    api.get('/productos?taller_id=1')
      .then(res => setProductos(res.data))
  }, [])

  return (
    <div>
      <h4>Catálogo</h4>

      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CatalogoOperario
