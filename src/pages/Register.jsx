import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AutocompleteInput from "../components/AutocompleteInput";
import AuthFloatingBackground from "../components/AuthFloatingBackground";

const emailDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

const buildEmailSuggestions = (email) => {
  const [localPart, domainPart = ""] = email.split("@");
  if (!localPart) return [];
  return emailDomains
    .filter(domain => !email.includes("@") || domain.startsWith(domainPart.toLowerCase()))
    .map(domain => `${localPart}@${domain}`);
};

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
      <AuthFloatingBackground />

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: "20px" }}>Registro </h2>

        <input
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) =>
            setForm({ ...form, nombre: e.target.value })
          }
          autoComplete="name"
          style={styles.input}
        />

        <AutocompleteInput
          id="register-email-suggestions"
          placeholder="Email"
          options={buildEmailSuggestions(form.email)}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          autoComplete="email"
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          autoComplete="new-password"
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
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate"
  },
  form: {
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    position: "relative",
    zIndex: 1
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
