import { useEffect, useState } from 'react'
import api from '../../services/api'

function DashboardAsesor() {
  const [citas, setCitas] = useState([])
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    api.get('/citas?taller_id=1').then(res => setCitas(res.data))
    api.get('/pedidos?taller_id=1').then(res => setPedidos(res.data))
  }, [])

  const hoy = new Date().toISOString().split('T')[0]

  const citasHoy = citas.filter(c => c.fecha === hoy).length
  const pedidosActivos = pedidos.filter(p => p.estado === 'Activo').length

  return (
    <div>
      <h4>Panel del Asesor</h4>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h6>Citas Hoy</h6>
            <h3>{citasHoy}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h6>Pedidos Activos</h6>
            <h3>{pedidosActivos}</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAsesor
