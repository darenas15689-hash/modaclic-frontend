import { useState } from "react";
import AutocompleteInput from "../../components/AutocompleteInput";
import api from "../../services/api";

const tiposPrenda = [
  "Saco Clasico", "Saco Slim Fit", "Pantalon Jeans", "Camisa",
  "Vestido", "Falda", "Chaqueta", "Blazer", "Camiseta"
];

const telas = [
  "Algodon", "Poliester", "Lana", "Seda", "Denim", "Lino", "Cuero"
];

export default function CalculadoraPrecio() {
  const [form, setForm] = useState({
    tipo_prenda: "",
    tela: "",
    cantidad: 1
  });
  const [precio, setPrecio] = useState(null);

  const calcular = async () => {
    const res = await api.post("/calculadora/precio", form);
    setPrecio(res.data.precio_estimado);
  };

  return (
    <div>
      <h3>Calculadora de Precio</h3>

      <AutocompleteInput
        id="calculadora-tipos-prenda"
        placeholder="Tipo prenda"
        options={tiposPrenda}
        value={form.tipo_prenda}
        onChange={e => setForm({...form, tipo_prenda: e.target.value})} />

      <AutocompleteInput
        id="calculadora-telas"
        placeholder="Tela"
        options={telas}
        value={form.tela}
        onChange={e => setForm({...form, tela: e.target.value})} />

      <input type="number"
        value={form.cantidad}
        onChange={e => setForm({...form, cantidad: e.target.value})} />

      <button onClick={calcular}>Calcular</button>

      {precio && <h4>Total: ${precio}</h4>}
    </div>
  );
}
