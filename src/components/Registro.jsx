import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Registro.css";
import BASE_URL from "../apiConfig";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setError] = useState(""); 
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


  const handleRegistro = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
        limpiarMensajes();
        return;
    }

    try {
      const response = await fetch(`${BASE_URL}/Usuario/ActualizarContraseña`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, NuevaContraseña: password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registro");
      }

      const data = await response.json();
      

      setSuccessMessage(data.mensaje || "Registro exitoso. Revisa tu correo para confirmar la contraseña.");
      setError("");
      limpiarMensajes();
      setTimeout(() => navigate("/login"), 5000); // Redirigir al login después de 5 segundos
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
      setSuccessMessage("");
      limpiarMensajes();
    }
  };


  return (
    <div className="registro-container">
      <h1>Bienvenido/a</h1>
      <h2>Registro</h2>
      <form onSubmit={handleRegistro}>
        <div>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Registro;
