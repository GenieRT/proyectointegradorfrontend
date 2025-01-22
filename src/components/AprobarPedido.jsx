import React, { useState, useEffect } from "react";
import "../styles/AprobarPedido.css";

const AprobarPedido = () => {
  const [pedidoId, setPedidoId] = useState(""); // Para almacenar el ID del pedido seleccionado
  const [pedidos, setPedidos] = useState([]); // Lista de pedidos pendientes
  const [error, setError] = useState(null); // Para manejar errores
  const [loading, setLoading] = useState(false); // Estado de carga
  const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito

  // Cargar pedidos pendientes desde el backend
  useEffect(() => {
    const fetchPedidosPendientes = async () => {
      try {
        const response = await fetch("https://localhost:7218/api/v1/Pedido/PedidosPendientes", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        });

        if (!response.ok) {
          const errorData = await response.json(); // Lee la respuesta JSON del error
          throw new Error(errorData.message || "Error desconocido"); // Captura el mensaje del backend
        }
  
        const data = await response.json();
        setPedidos(data); // Actualiza la lista de pedidos pendientes
      } catch (error) {
        console.error("Error al obtener los pedidos pendientes:", error.message);
        setError(error.message); // Muestra el mensaje específico del backend
      }
    };

    fetchPedidosPendientes();
  }, []); 

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
        const error = await response.json();
        console.error("Error:", error);
        throw new Error(error.message || "Error desconocido");
      }

      setSuccessMessage("Pedido aprobado con éxito.");
      setPedidoId(""); 
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
          <label htmlFor="pedidoId">Seleccionar Pedido</label>
          <select
            id="pedidoId"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            required
          >
            <option value="">-- Seleccione un pedido --</option>
            {pedidos.map((pedido) => (
              <option key={pedido.id} value={pedido.id}>
                {`ID: ${pedido.id} | Estado: ${pedido.estado} | Fecha: ${pedido.fecha} | ID Cliente: ${pedido.clienteId}`}              </option>
            ))}
          </select>
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
