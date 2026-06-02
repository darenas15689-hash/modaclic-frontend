import { useState } from 'react'
import api from '../services/api'

const API_BASE = 'http://localhost:5000/api'

// ===================== POOLS DE DATOS =====================
const clientes = [
  'María García', 'Juan Rodríguez', 'Ana Martínez', 'Carlos López',
  'Laura Sánchez', 'Pedro Ramírez', 'Isabel Torres', 'Miguel Flores',
  'Sofía Herrera', 'Luis Moreno', 'Carmen Ruiz', 'José Jiménez',
  'Elena Díaz', 'Roberto Castro', 'Patricia Álvarez', 'Fernando Romero',
  'Diana Vargas', 'Alejandro Cruz', 'Valentina Reyes', 'Andrés Mendoza',
  'Camila Ríos', 'Sebastián Muñoz', 'Paola Navarro', 'Ricardo Ortega'
]

const productosRopa = [
  'Saco Clásico', 'Saco Slim Fit', 'Saco Formal', 'Pantalón Jeans',
  'Pantalón Drill', 'Pantalón Formal', 'Camisa Manga Larga', 'Camisa Manga Corta',
  'Chaqueta', 'Blazer', 'Vestido Casual', 'Falda Midi', 'Overol', 'Sudadera',
  'Polo Clásico', 'Abrigo', 'Chaleco', 'Short Deportivo', 'Hoodie', 'Camiseta'
]

const tallas   = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40']
const colores  = ['#000000', '#FFFFFF', '#CC0000', '#0055CC', '#8B4513', '#555555', '#800000', '#006666', '#FFD700', '#FFC0CB']
const coloresNombre = ['Negro', 'Blanco', 'Azul Navy', 'Rojo', 'Gris', 'Beige', 'Verde Militar', 'Café', 'Amarillo', 'Rosa']
const tiposPrenda   = ['Masculina', 'Femenina', 'Unisex']
const estadosPedido = ['Activo', 'En proceso', 'Finalizado', 'Cancelado']
const estadosCot    = ['Cotizado', 'Aprobado', 'Rechazado']
const asesores      = ['Sara Vega', 'Tomás Peña', 'Lucía Mora', 'Diego Silva', 'Natalia Ríos']
const responsables  = ['Op. García', 'Op. Torres', 'Op. Méndez', 'Op. Ruiz', 'Op. Vega', 'Op. Castillo']
const telas         = ['Algodón', 'Poliéster', 'Lana', 'Seda', 'Denim', 'Lino', 'Jersey', 'Cuero Sintético']

const materiasBase = [
  { nombre: 'Algodón Pima', unidad: 'm' },
  { nombre: 'Poliéster Blanco', unidad: 'm' },
  { nombre: 'Lana Merino', unidad: 'kg' },
  { nombre: 'Seda Natural', unidad: 'm' },
  { nombre: 'Denim Azul', unidad: 'm' },
  { nombre: 'Lino Beige', unidad: 'm' },
  { nombre: 'Hilo Negro 40/2', unidad: 'unidades' },
  { nombre: 'Hilo Blanco 40/2', unidad: 'unidades' },
  { nombre: 'Botones Nácar', unidad: 'unidades' },
  { nombre: 'Cremallera YKK 20cm', unidad: 'unidades' },
  { nombre: 'Elástico 2cm', unidad: 'm' },
  { nombre: 'Encaje Bordado', unidad: 'm' },
  { nombre: 'Ribete Dorado', unidad: 'm' },
  { nombre: 'Entretela Termofusible', unidad: 'm' },
  { nombre: 'Forro Acetato Negro', unidad: 'm' },
]

// ===================== HELPERS =====================
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randDate = () => {
  const d = new Date()
  d.setDate(d.getDate() + randInt(-30, 60))
  return d.toISOString().split('T')[0]
}
const randDatetime = () => {
  const d = new Date()
  d.setDate(d.getDate() + randInt(-90, 30))
  d.setHours(randInt(8, 18), pick([0, 15, 30, 45]), 0)
  return d.toISOString().slice(0, 16)
}

// ===================== GENERADORES =====================
const genPedidos = (n = 100) =>
  Array.from({ length: n }, () => ({
    cliente: pick(clientes),
    producto: pick(productosRopa),
    total: randInt(80000, 900000),
    estado: pick(estadosPedido),
    tipo_prenda: pick(tiposPrenda),
    talla: pick(tallas),
    medidas_personalizadas: '',
    color: pick(colores),
    taller_id: 1
  }))

const genCitas = (n = 100) =>
  Array.from({ length: n }, () => ({
    cliente: pick(clientes),
    fecha: randDatetime(),
    asesor: pick(asesores),
    taller_id: 1
  }))

const genOrdenes = (n = 100) =>
  Array.from({ length: n }, () => ({
    pedido_id: randInt(1, 30),
    producto: pick(productosRopa),
    cantidad: randInt(1, 50),
    responsable: pick(responsables),
    fecha_estimada: randDate(),
    taller_id: 1
  }))

const genCotizaciones = (n = 100) =>
  Array.from({ length: n }, () => ({
    cliente: pick(clientes),
    tipo_prenda: pick(productosRopa),
    tela: pick(telas),
    cantidad: randInt(1, 100),
    precio_estimado: randInt(30000, 600000),
    tiempo_estimado: `${randInt(3, 30)} días`,
    estado: pick(estadosCot)
  }))

const genInventarioProductos = (n = 100) =>
  Array.from({ length: n }, () => ({
    nombre: pick(productosRopa),
    tipo: pick(tiposPrenda),
    talla: pick(tallas),
    color: pick(coloresNombre),
    stock: randInt(1, 250)
  }))

const genMateriaPrima = (n = 100) =>
  Array.from({ length: n }, () => {
    const m = pick(materiasBase)
    return { nombre: m.nombre, unidad: m.unidad, stock: randInt(5, 800) }
  })

// ===================== COMPONENTE =====================
const MODULES = [
  {
    label: 'Pedidos',
    color: '#6366f1',
    gen: () => genPedidos(100),
    post: (item) => api.post('/pedidos', item)
  },
  {
    label: 'Citas',
    color: '#ec4899',
    gen: () => genCitas(100),
    post: (item) => api.post('/citas', item)
  },
  {
    label: 'Órdenes de Producción',
    color: '#f59e0b',
    gen: () => genOrdenes(100),
    post: (item) =>
      fetch(`${API_BASE}/produccion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
  },
  {
    label: 'Cotizaciones',
    color: '#10b981',
    gen: () => genCotizaciones(100),
    post: (item) =>
      fetch(`${API_BASE}/cotizaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
  },
  {
    label: 'Inventario Productos',
    color: '#06b6d4',
    gen: () => genInventarioProductos(100),
    post: (item) =>
      fetch(`${API_BASE}/inventario/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
  },
  {
    label: 'Materia Prima',
    color: '#8b5cf6',
    gen: () => genMateriaPrima(100),
    post: (item) =>
      fetch(`${API_BASE}/inventario/materia-prima`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
  }
]

export default function SeedPage() {
  const [running, setRunning]   = useState(false)
  const [done, setDone]         = useState(false)
  const [log, setLog]           = useState([])
  const [progress, setProgress] = useState({})

  const addLog = (msg) => setLog((prev) => [msg, ...prev])

  const seedModule = async (mod) => {
    const items = mod.gen()
    addLog(`⏳ ${mod.label}: enviando ${items.length} registros...`)
    let ok = 0, err = 0

    for (const item of items) {
      try {
        await mod.post(item)
        ok++
      } catch {
        err++
      }
      setProgress((p) => ({
        ...p,
        [mod.label]: { ok, err, total: items.length, color: mod.color }
      }))
    }
    addLog(`✅ ${mod.label}: ${ok} exitosos${err > 0 ? `, ${err} errores` : ''}`)
  }

  const seedAll = async () => {
    setRunning(true)
    setDone(false)
    setLog([])
    setProgress({})
    addLog('🚀 Iniciando generación de datos de prueba...')

    for (const mod of MODULES) {
      await seedModule(mod)
    }

    addLog('🎉 ¡Proceso completado! Navega a cada módulo para ver los datos.')
    setRunning(false)
    setDone(true)
  }

  const total = Object.values(progress).reduce((s, v) => s + v.ok, 0)

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>🌱 Herramienta de Datos de Prueba</h4>
        <p className="text-secondary" style={{ marginBottom: 16 }}>
          Genera <strong>~100 registros</strong> en cada módulo para probar la paginación.
          Asegúrate de estar logueado antes de ejecutar.
        </p>

        <button
          id="btn-seed-all"
          className="btn btn-warning fw-bold px-4"
          onClick={seedAll}
          disabled={running}
          style={{ borderRadius: 30, fontSize: 15 }}
        >
          {running ? '⏳ Generando datos, espera...' : '🚀 Generar ~100 registros por módulo'}
        </button>

        {done && (
          <div className="alert alert-success mt-3 py-2 px-3" role="alert">
            ✅ Datos generados correctamente — <strong>{total}</strong> registros insertados en total.
          </div>
        )}
      </div>

      {/* Barras de progreso */}
      {Object.entries(progress).map(([label, { ok, err, total: t, color }]) => (
        <div key={label} className="mb-3">
          <div className="d-flex justify-content-between mb-1">
            <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
            <span className="text-secondary" style={{ fontSize: 13 }}>
              {ok}/{t}{err > 0 ? ` · ${err} errores` : ''}
            </span>
          </div>
          <div className="progress" style={{ height: 10, borderRadius: 10 }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{
                width: `${Math.round((ok / t) * 100)}%`,
                backgroundColor: color,
                borderRadius: 10,
                transition: 'width 0.15s ease'
              }}
            />
          </div>
        </div>
      ))}

      {/* Log de eventos */}
      {log.length > 0 && (
        <div
          style={{
            background: '#0f172a',
            color: '#86efac',
            padding: '14px 16px',
            borderRadius: 10,
            fontFamily: 'monospace',
            fontSize: 13,
            maxHeight: 260,
            overflowY: 'auto',
            marginTop: 16
          }}
        >
          {log.map((msg, i) => (
            <div key={i} style={{ marginBottom: 3 }}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  )
}
