import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);

      const { token, rol } = res.data;

      // 🔐 Guardar sesión
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      console.log("ROL RECIBIDO:", rol);

      // 🚀 REDIRECCIÓN SEGURA
      switch (rol) {
        case "admin":
          navigate("/admin-taller/dashboard");
          break;

        case "asesor":
          navigate("/asesor/dashboard");
          break;

        case "operario":
          navigate("/operario/dashboard");
          break;

        default:
          alert("Rol no reconocido: " + rol);
          navigate("/");
      }

    } catch (err) {
      console.log("ERROR LOGIN:", err.response?.data);

      alert(err.response?.data?.msg || "Error al iniciar sesión");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

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

        <button type="submit" style={styles.button}>
          Iniciar Sesión
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