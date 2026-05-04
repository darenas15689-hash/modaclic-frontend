import { useEffect, useState } from 'react'
import api from '../../services/api'

function CitasAdminTaller() {
  const [citas,setCitas] = useState([])
  const [nueva,setNueva] = useState({cliente:'',fecha:'',asesor:''})
  const taller_id = 1

  const cargarCitas = async ()=>{
    try{ const res = await api.get(`/citas?taller_id=${taller_id}`); setCitas(res.data) }
    catch(error){ console.error(error) }
  }

  useEffect(()=>{ cargarCitas() },[])

  const agregarCita = async ()=>{
    if(!nueva.cliente || !nueva.fecha || !nueva.asesor) return alert("Todos los campos son requeridos")
    try{ await api.post('/citas',{...nueva,taller_id}); setNueva({cliente:'',fecha:'',asesor:''}); cargarCitas() }
    catch(error){ console.error(error) }
  }

  const reprogramar = async(cita)=>{
    const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD HH:MM):",cita.fecha)
    if(!nuevaFecha) return
    try{ await api.put(`/citas/${cita.id}`,{...cita,fecha:nuevaFecha}); cargarCitas() }
    catch(error){ console.error(error) }
  }

  const cancelar = async(id)=>{
    if(window.confirm("¿Cancelar cita?")){
      try{ await api.delete(`/citas/${id}`); cargarCitas() }
      catch(error){ console.error(error) }
    }
  }

  return (
    <div>
      <h4>Citas del Taller</h4>
      <div className="card p-3 mb-3">
        <h6>Agregar Nueva Cita</h6>
        <div className="d-flex gap-2 flex-wrap">
          <input type="text" placeholder="Cliente" className="form-control"
                 value={nueva.cliente} onChange={e=>setNueva({...nueva,cliente:e.target.value})}/>
          <input type="datetime-local" className="form-control"
                 value={nueva.fecha} onChange={e=>setNueva({...nueva,fecha:e.target.value})}/>
          <input type="text" placeholder="Servicio" className="form-control"
                 value={nueva.asesor} onChange={e=>setNueva({...nueva,asesor:e.target.value})}/>
          <button className="btn btn-success" onClick={agregarCita}>Agregar Cita</button>
        </div>
      </div>

      <table className="table table-dark table-hover">
        <thead><tr><th>Cliente</th><th>Fecha</th><th>Servicio</th><th>Acción</th></tr></thead>
        <tbody>
          {citas.map(c=>(
            <tr key={c.id}>
              <td>{c.cliente}</td>
              <td>{new Date(c.fecha).toLocaleString()}</td>
              <td>{c.asesor}</td>
              <td className="d-flex gap-1">
                <button className="btn btn-sm btn-primary" onClick={()=>reprogramar(c)}>Reprogramar</button>
                <button className="btn btn-sm btn-danger" onClick={()=>cancelar(c.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CitasAdminTaller
