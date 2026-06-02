import { useState } from "react";
import { login } from "../services/authService";
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
      <AuthFloatingBackground />

      <div style={styles.registerBanner}>
        <span style={{ fontSize: "14px", color: "#555" }}>¿No tienes cuenta?</span>
        <button
          type="button"
          id="btn-go-register"
          style={styles.registerBtn}
          onClick={() => navigate("/register")}
        >
          Crear cuenta →
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom: "20px" }}>Login</h2>

        <AutocompleteInput
          id="login-email-suggestions"
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
          autoComplete="current-password"
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
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    position: "relative",
    overflow: "hidden",
    isolation: "isolate"
  },
  registerBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "white",
    padding: "10px 20px",
    borderRadius: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
    position: "relative",
    zIndex: 1
  },
  registerBtn: {
    padding: "6px 16px",
    background: "#ff69b4",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px"
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
