import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setReservas } from '../features/reservaSlice'; // Asegúrate de que la acción setReservas esté definida

const ListarReservasEmpleado = () => {
  const dispatch = useDispatch();
  const { reservas } = useSelector((state) => state.reserva);


  
  useEffect(() => {
    // Obtén el token de localStorage
    const token = `Bearer ${localStorage.getItem("token")}`;

    if (!token) {
      console.error('Token no encontrado');
      return; // Si no hay token, no realizamos la solicitud
    }

    // Realiza la solicitud con el token
    fetch('https://isusawebapi.azurewebsites.net/api/v1/Reserva/ReservasEmpleado', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Token JWT
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setReservas(data)); // Guardamos las reservas en el estado
      })
      .catch((error) => {
        console.error('Error al obtener las reservas', error);
      });
  }, [dispatch]);

  return (
    <div>
      <h2>Listado de Reservas</h2>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>ID Reserva</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Pedido Id</th>
            <th>Cliente Id</th>
            <th>Camión</th>
            <th>Chofer</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.id}</td>
              <td>{reserva.fecha}</td>
              <td>{reserva.estadoReserva}</td>
              <td>{reserva.pedidoId}</td>
              <td>{reserva.clienteId}</td>
              <td>{reserva.camion}</td>
              <td>{reserva.chofer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListarReservasEmpleado;
