import { useEffect, useState } from "react";
import AutocompleteInput from "../../components/AutocompleteInput";
import api from "../../services/api";

export default function Cotizaciones() {
  const [lista, setLista] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  // ========================= PAGINACIÓN =========================
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // ========================= ORDEN INVERTIDO + PAGINACIÓN =========================
  const listaInvertida = [...lista].reverse();
  const totalPages = Math.ceil(listaInvertida.length / itemsPerPage);
  const currentItems = listaInvertida.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // =========================
  // CARGAR COTIZACIONES
  // =========================
  const cargar = async () => {
    const res = await api.get("/cotizaciones");
    setLista(res.data);
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
    const url = editandoId ? `/cotizaciones/${editandoId}` : "/cotizaciones";

    if (method === "PUT") {
      await api.put(url, form);
    } else {
      await api.post(url, form);
    }

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
    setCurrentPage(1); // Volver a la primera página para ver el nuevo registro
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

    await api.delete(`/cotizaciones/${id}`);
    // Ajustar página si la actual queda vacía tras eliminar
    const newTotal = Math.ceil((lista.length - 1) / itemsPerPage);
    if (currentPage > newTotal && newTotal > 0) setCurrentPage(newTotal);
    cargar();
  };

  return (
    <div>
      <h3>Cotizaciones</h3>

      {/* ================= FORMULARIO ================= */}
      <div className="card p-3 mb-4">
        <h5>{editandoId ? "Editar Cotización" : "Nueva Cotización"}</h5>

        {/* CLIENTE */}
        <AutocompleteInput
          id="cotizaciones-clientes"
          className="form-control mb-2"
          placeholder="Cliente"
          options={clientes}
          value={form.cliente}
          onChange={e => setForm({ ...form, cliente: e.target.value })}
        />

        {/* TIPO PRENDA */}
        <AutocompleteInput
          id="cotizaciones-prendas"
          className="form-control mb-2"
          placeholder="Tipo prenda"
          options={prendas}
          value={form.tipo_prenda}
          onChange={e => setForm({ ...form, tipo_prenda: e.target.value })}
        />

        {/* TELA */}
        <AutocompleteInput
          id="cotizaciones-telas"
          className="form-control mb-2"
          placeholder="Tela"
          options={telas}
          value={form.tela}
          onChange={e => setForm({ ...form, tela: e.target.value })}
        />

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
          {currentItems.map(c => (
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
            Página {currentPage} de {totalPages} &nbsp;·&nbsp; {lista.length} registros
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
  );
}
