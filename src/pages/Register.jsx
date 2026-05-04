import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "asesor"
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(form);
      alert("Usuario creado correctamente");
      navigate("/");
    } catch (err) {
      console.log("ERROR BACKEND:", err.response?.data);
      alert(err.response?.data?.msg || "Error al registrar usuario");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: "20px" }}>Registro </h2>

        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
          style={styles.input}
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={styles.input}
        />

        <select
          value={form.rol}
          onChange={(e) =>
            setForm({ ...form, rol: e.target.value })
          }
          style={styles.input}
        >
          <option value="admin">Admin</option>
          <option value="asesor">Asesor</option>
          <option value="operario">Operario</option>
        </select>

        <button type="submit" style={styles.button}>
          Registrarse
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(#ff69b4, white)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  form: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#ff69b4",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};