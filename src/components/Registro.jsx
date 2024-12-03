import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleRegistro = (e) => {
    e.preventDefault();

    fetch("https://localhost:7218/api/Usuario/ActualizarContraseña", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, NuevaContraseña: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en el registro");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Registro exitoso:", data);
        setSuccessMessage("Registro exitoso. Por favor, revise su correo para confirmar su contraseña.");
        setErrorMessage("");
        //setTimeout(() => navigate("/login"), 5000); // Redirigir al login después de 5 segundos
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage(error.message);
        setSuccessMessage("");
      });
  };

  return (
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleRegistro}>
        <div>
          <label>Email:</label>
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Registro;
