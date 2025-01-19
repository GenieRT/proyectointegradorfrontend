import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Registro.css";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleRegistro = (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden.");
        setSuccessMessage("");
        return;
    }

    fetch("https://localhost:7218/api/Usuario/ActualizarContraseña", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, NuevaContraseña: password }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.mensaje || "Error en el registro");
        });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registro exitoso:", data);
        setSuccessMessage("Registro exitoso. Por favor, revise su correo para confirmar su contraseña.");
        setErrorMessage("");
        setTimeout(() => navigate("/login"), 5000); // Redirigir al login después de 5 segundos
      })
      .catch((error) => {
        console.error("Error:", error.message);
        setErrorMessage(error.message);
        setSuccessMessage("");
      });
  };

  return (
    <div className="registro-container">
      <h1>Registro</h1>
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
