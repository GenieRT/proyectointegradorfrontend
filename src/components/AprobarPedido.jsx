import React, { useState } from "react";
import "../styles/AprobarPedido.css";

const AprobarPedido = () => {
  const [pedidoId, setPedidoId] = useState(""); // Para almacenar el ID del pedido
  const [error, setError] = useState(null); // Para manejar errores
  const [loading, setLoading] = useState(false); // Estado de carga
  const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await fetch(`https://localhost:7218/api/v1/Pedido/AprobarPedido?pedidoId=${pedidoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token JWT
        },
      });

      if (!response.ok) {
        throw new Error("Error al aprobar el pedido. Verifique los datos o permisos.");
      }
      if (!response.ok) {
        const error = await response.json();
        console.error("Error:", error);
        throw new Error(error.message || "Error desconocido");
      }
      

      setSuccessMessage("Pedido aprobado con éxito.");
      setPedidoId(""); // Limpia el campo después de la operación
    } catch (error) {
      console.error("Error al aprobar pedido:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aprobar-pedido-container">
      <h2>Aprobar Pedido</h2>
      <form onSubmit={handleSubmit} className="aprobar-pedido-form">
        <div className="form-group">
          <label htmlFor="pedidoId">ID del Pedido</label>
          <input
            type="text"
            id="pedidoId"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="aprobar-pedido-button" disabled={loading}>
          {loading ? "Procesando..." : "Aprobar Pedido"}
        </button>
      </form>
    </div>
  );
};

export default AprobarPedido;
