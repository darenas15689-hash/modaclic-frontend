import { useState } from "react";

export default function CalculadoraPrecio() {
  const [form, setForm] = useState({
    tipo_prenda: "",
    tela: "",
    cantidad: 1
  });
  const [precio, setPrecio] = useState(null);

  const calcular = async () => {
    const res = await fetch("http://localhost:5000/api/calculadora/precio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setPrecio(data.precio_estimado);
  };

  return (
    <div>
      <h3>Calculadora de Precio</h3>

      <input placeholder="Tipo prenda"
        onChange={e => setForm({...form, tipo_prenda: e.target.value})} />

      <input placeholder="Tela"
        onChange={e => setForm({...form, tela: e.target.value})} />

      <input type="number"
        onChange={e => setForm({...form, cantidad: e.target.value})} />

      <button onClick={calcular}>Calcular</button>

      {precio && <h4>Total: ${precio}</h4>}
    </div>
  );
}
