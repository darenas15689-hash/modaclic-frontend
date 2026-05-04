import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/cotizaciones";

export default function Cotizaciones() {
  const [lista, setLista] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    cliente: "",
    tipo_prenda: "",
    tela: "",
    cantidad: "",
    precio_estimado: "",
    tiempo_estimado: "",
    estado: "Cotizado"
  });

  // =========================
  // AUTOCOMPLETADO (NUEVO)
  // =========================
  const clientes = [...new Set(lista.map(c => c.cliente))];
  const prendas = [...new Set(lista.map(c => c.tipo_prenda))];
  const telas = [...new Set(lista.map(c => c.tela))];

  // =========================
  // CARGAR COTIZACIONES
  // =========================
  const cargar = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setLista(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  // =========================
  // CREAR / EDITAR
  // =========================
  const guardar = async () => {
    if (!form.cliente || !form.tipo_prenda || !form.tela) {
      alert("Complete los campos obligatorios");
      return;
    }

    const method = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({
      cliente: "",
      tipo_prenda: "",
      tela: "",
      cantidad: "",
      precio_estimado: "",
      tiempo_estimado: "",
      estado: "Cotizado"
    });

    setEditandoId(null);
    cargar();
  };

  // =========================
  // EDITAR
  // =========================
  const editar = (c) => {
    setForm(c);
    setEditandoId(c.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar cotización?")) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargar();
  };

  return (
    <div>
      <h3>Cotizaciones</h3>

      {/* ================= FORMULARIO ================= */}
      <div className="card p-3 mb-4">
        <h5>{editandoId ? "Editar Cotización" : "Nueva Cotización"}</h5>

        {/* CLIENTE */}
        <input
          className="form-control mb-2"
          placeholder="Cliente"
          list="clientes"
          value={form.cliente}
          onChange={e => setForm({ ...form, cliente: e.target.value })}
        />
        <datalist id="clientes">
          {clientes.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>

        {/* TIPO PRENDA */}
        <input
          className="form-control mb-2"
          placeholder="Tipo prenda"
          list="prendas"
          value={form.tipo_prenda}
          onChange={e => setForm({ ...form, tipo_prenda: e.target.value })}
        />
        <datalist id="prendas">
          {prendas.map((p, i) => (
            <option key={i} value={p} />
          ))}
        </datalist>

        {/* TELA */}
        <input
          className="form-control mb-2"
          placeholder="Tela"
          list="telas"
          value={form.tela}
          onChange={e => setForm({ ...form, tela: e.target.value })}
        />
        <datalist id="telas">
          {telas.map((t, i) => (
            <option key={i} value={t} />
          ))}
        </datalist>

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={e => setForm({ ...form, cantidad: e.target.value })}
        />

        <input
          type="number"
          className="form-control mb-2"
          placeholder="Precio estimado"
          value={form.precio_estimado}
          onChange={e => setForm({ ...form, precio_estimado: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Tiempo estimado"
          value={form.tiempo_estimado}
          onChange={e => setForm({ ...form, tiempo_estimado: e.target.value })}
        />

        <select
          className="form-select mb-2"
          value={form.estado}
          onChange={e => setForm({ ...form, estado: e.target.value })}
        >
          <option>Cotizado</option>
          <option>Aprobado</option>
          <option>Rechazado</option>
        </select>

        <button className="btn btn-success" onClick={guardar}>
          {editandoId ? "Actualizar" : "Guardar"}
        </button>
      </div>

      {/* ================= TABLA ================= */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Prenda</th>
            <th>Tela</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(c => (
            <tr key={c.id}>
              <td>{c.cliente}</td>
              <td>{c.tipo_prenda}</td>
              <td>{c.tela}</td>
              <td>{c.cantidad}</td>
              <td>${c.precio_estimado}</td>
              <td>{c.estado}</td>
              <td className="d-flex gap-2">
                <button className="btn btn-sm btn-primary" onClick={() => editar(c)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => eliminar(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}