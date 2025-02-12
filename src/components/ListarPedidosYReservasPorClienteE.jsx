import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/ListarPedidosYReservasPorClienteE.css";
import BASE_URL from "../apiConfig";





const PedidosYReservasPorCliente = () => {
  const { token } = useSelector((state) => state.auth); // Obtener el token desde Redux
  const [clientes, setClientes] = useState([]);
  const [selectedClienteId, setSelectedClienteId] = useState("");
  const [pedidosReservas, setPedidosReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");



  //limpiar mensajes
  //----------------------------------------------------------------------------
  const limpiarMensajes = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage("");
    }, 3000); // Los mensajes desaparecerán después de 3 segundos
  }
  //----------------------------------------------------------------------------------

  // Obtener lista de clientes al cargar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/v1/Cliente`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al obtener los clientes");

        const data = await response.json();
        setClientes(data);
      } catch (err) {
        setError(err.message);
        limpiarMensajes();
      }
    };

    fetchClientes();
  }, [token]);

  // Obtener pedidos y reservas de un cliente seleccionado
  const fetchPedidosYReservas = async (clienteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/v1/Pedido/PedidosYReservas?clienteId=${clienteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener pedidos y reservas");

      const data = await response.json();
      setPedidosReservas(data);
    } catch (err) {
      setError(err.message);
      limpiarMensajes();
    } finally {
      setLoading(false);
    }
  };

  const handleClienteChange = (e) => {
    const clienteId = e.target.value;
    setSelectedClienteId(clienteId);

    if (clienteId) {
      fetchPedidosYReservas(clienteId);
    } else {
      setPedidosReservas([]);
    }
  };

  return (
    <div className="pedidos-reservas-container">
      <h2>Pedidos y Reservas por Cliente</h2>
      <form className="pedidos-reservas-form">
        <div className="form-group">
          <label htmlFor="clienteSelect">Seleccionar Cliente:</label>
          <select
            id="clienteSelect"
            value={selectedClienteId}
            onChange={handleClienteChange}
          >
            <option value="">-- Seleccione un cliente --</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.id} - {cliente.nombre} - {cliente.email}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Mensajes de carga o error */}
      {loading && <p>Cargando...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Mostrar Pedidos y Reservas */}
      {!loading && pedidosReservas.pedidos && pedidosReservas.reservas && (
        <div className="pedidos-reservas-data">
          <h3>Pedidos</h3>
          {pedidosReservas.pedidos.length > 0 ? (
            <table className="table" >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Productos</th>
                </tr>
              </thead>
              <tbody>
                {pedidosReservas.pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                    <td>{pedido.estado}</td>
                    <td>
                      {pedido.productos.length > 0 ? (
                        <ul>
                          {pedido.productos.map((producto) => (
                            <li key={producto.id}>
                              {`${producto.producto.descripcion} - ${producto.cantidad} TON`}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="noProductos">"No hay productos"</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay pedidos disponibles.</p>
          )}

          <h3>Reservas</h3>
          {pedidosReservas.reservas.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Chofer</th>
                  <th>Camión</th>
                  <th>Productos Reservados</th>
                </tr>
              </thead>
              <tbody>
                {pedidosReservas.reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td>{reserva.id}</td>
                    <td>{new Date(reserva.fecha).toLocaleDateString()}</td>
                    <td>{reserva.chofer}</td>
                    <td>{reserva.camion}</td>
                    <td>
                      {reserva.lineasReservas.length > 0 ? (
                        <ul>
                          {reserva.lineasReservas.map((linea) => (
                            <li key={linea.id}>
                              {`${linea.producto.descripcion} - ${linea.cantidadReservada} TON`}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No hay productos reservados"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay reservas disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PedidosYReservasPorCliente;
