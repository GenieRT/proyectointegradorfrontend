import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ListarPedidosYReservas = () => {
  const { token, clienteId } = useSelector((state) => state.auth); // Obtener token y clienteId
  //const [pedidosReservas, setPedidosReservas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidosYReservas = async () => {
      try {
        const response = await fetch(
          `https://isusawebapi.azurewebsites.net/api/v1/Pedido/PedidosYReservas?clienteId=${clienteId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los pedidos y reservas");
        }

        const data = await response.json();
        //setPedidosReservas(data.pedidos);
        setPedidos(data.pedidos); // Acceder a la propiedad 'pedidos'
        setReservas(data.reservas); // Acceder a la propiedad 'reservas'
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (clienteId) {
      fetchPedidosYReservas();
    } else {
      setError("ID del cliente no disponible.");
      setLoading(false);
    }
  }, [token, clienteId]);

  const handleNavigateToReserva = (pedidoId) => {
    navigate(`/registrarReserva?pedidoId=${pedidoId}`); // Redirige con el ID del pedido
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Pedidos y Reservas</h2>

      {/* Mostrar Pedidos */}
      <section>
        <h3>Pedidos</h3>
        {pedidos.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Productos</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                  <td>{pedido.estado}</td>
                  <td>
                    {pedido.productos.length > 0 ? (
                      <ul>
                        {pedido.productos.map((prod) => (
                          <li key={prod.id}>
                            {/* Validar que producto no sea null */}
                            {prod.producto ? prod.producto.descripcion : "Producto desconocido"}{" "}
                            - {prod.cantidad} TON
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span style={{ color: "gray", fontStyle: "italic" }}>No hay productos</span>
                    )}
                  </td>
                  <td>
                  {pedido.estado === "CERRADO" && pedido.reservas.length > 0 ? (
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        padding: "5px 10px",
                        backgroundColor: "#e6ffe6",
                        borderRadius: "5px",
                        display: "inline-block",
                      }}
                    >
                      Pedido ya reservado
                    </span>
                  ) : (
                    <button
                      onClick={() => handleNavigateToReserva(pedido.id)}
                      disabled={pedido.estado !== "APROBADO"} // Deshabilitar si el estado no es APROBADO
                      style={{
                        cursor:
                          pedido.estado === "APROBADO"
                            ? "pointer"
                            : "not-allowed", // Cambia el cursor
                        opacity: pedido.estado === "APROBADO" ? 1 : 0.5, // Ajusta la opacidad
                      }}
                      title={
                        pedido.estado !== "APROBADO"
                          ? "Este pedido debe ser aprobado antes de poder registrar una reserva."
                          : ""
                      }
                    >
                      Registrar Reserva
                    </button>
                  )}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay pedidos disponibles.</p>
        )}
      </section>

      {/* Mostrar Reservas */}
      <section style={{ marginTop: "20px" }}>
        <h3>Reservas</h3>
        {reservas.length > 0 ? (
          <table border="1">
            <thead>
              <tr>
                <th>ID Reserva</th>
                <th>Fecha</th>
                <th>Camión</th>
                <th>Chofer</th>
                <th>Productos Reservados</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.id}</td>
                  <td>{new Date(reserva.fecha).toLocaleDateString()}</td>
                  <td>{reserva.camion}</td>
                  <td>{reserva.chofer}</td>
                  <td>
                    {reserva.lineasReservas.length > 0 ? (
                      <ul>
                        {reserva.lineasReservas.map((linea) => (
                          <li key={linea.id}>
                            {linea.producto
                              ? linea.producto.descripcion
                              : "Producto desconocido"}{" "}
                            - {linea.cantidadReservada} TON
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
      </section>
    </div>
  );
};

export default ListarPedidosYReservas;
