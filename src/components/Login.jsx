import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../features/authSlice";


const Login = () => {
  const [email, setEmail] = useState(""); // Para almacenar el email del usuario
  const [password, setPassword] = useState(""); // Para almacenar la contraseña
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setSuccessMessage(null);
    setError(null); 
 

    try {
      const response = await fetch("https://localhost:7218/api/Usuario/IniciarSesion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass: password }), // Enviar email y contraseña
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas o error del servidor.");
      }

      const data = await response.json(); // Respuesta del backend (esperamos un token y usuario)
      dispatch(setToken(data.token)); // Guardar el token en el slice de Redux

      setSuccessMessage("Inicio de sesión exitoso.");
      setError(null);
      console.log("Usuario autenticado:", data);

      // Redirigir al usuario a otra página (ejemplo: Dashboard)
      // window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message); // Mostrar el error al usuario
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;