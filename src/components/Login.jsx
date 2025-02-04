import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "../features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

import BASE_URL from "../apiConfig";

const Login = () => {
  const [email, setEmail] = useState(""); // Para almacenar el email del usuario
  const [password, setPassword] = useState(""); // Para almacenar la contraseña
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

 //limpiar mensajes
  //----------------------------------------------------------------------------
  const limpiarMensajes = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage("");
    }, 10000); // Los mensajes desaparecerán después de 3 segundos
  }
//----------------------------------------------------------------------------------


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setSuccessMessage(null);
    setError(null); 
 

    try {
      const response = await fetch(`${BASE_URL}/Usuario/IniciarSesion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass: password }), // Enviar email y contraseña
      });

      const data = await response.json();

      if (!response.ok) {
        // Si no es una respuesta válida, lanza un error con el mensaje del backend
        const errorMessage = data.message || "Credenciales inválidas o error del servidor.";
        throw new Error(errorMessage);
      }


      //dispatch(setToken(data.token)); // Guardar el token en el slice de Redux
      //dispatch(setToken({ token: data.token, role: data.role }));
      dispatch(
        setToken({
          token: data.token,
          role: data.role,
          clienteId: data.usuario.id,
        })
      );

      setSuccessMessage("Inicio de sesión exitoso.");
      limpiarMensajes();
      setError(null);
      console.log("Usuario autenticado:", data);
      navigate("/productos");

    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setError(error.message); // Mostrar el error al usuario
      limpiarMensajes();
    } finally {
      setLoading(false); // Finalizar el estado de carga
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
      <div className="register-link">
        <p>¿No tienes una cuenta?</p>
        <Link to="/registro">Regístrate aquí</Link>
      </div>
    </div>
  );
};

export default Login;
