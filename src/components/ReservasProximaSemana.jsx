import React, { useState, useEffect } from 'react';
import BASE_URL from '../apiConfig';
import '../styles/Message.css';
import "../styles/TablasYFormularios.css"
const ReservasProximaSemana = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem("token");

  //limpiar mensajes
  //----------------------------------------------------------------------------
 /* const limpiarMensajes = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage("");
    }, 3000); // Los mensajes desaparecerán después de 3 segundos
  } */
//----------------------------------------------------------------------------------

  useEffect(() => {
    fetch(`${BASE_URL}/v1/Reserva/ReservasSemanaProxima`, {
      // method: 'GET',
       headers: {
         "Authorization": `Bearer ${token}`,
       },
     })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }
        return response.json();
        
      })
      .then((data) => {
        setReservas(data); // Guardamos las reservas en el estado
      })
      .catch((error) => {
        console.error('Error al obtener las reservas:', error);
        setError('No hay reservas disponibles. Intente nuevamente más tarde.');
        //limpiarMensajes();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando reservas...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="title">Reservas de la próxima semana</h2>
      {reservas.length > 0 ? (
      <table className="table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Toneladas Reservadas</th>
            <th>Stock Disponible</th>
            <th>Alerta</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr
              key={reserva.productoId}
              style={{
                backgroundColor: reserva.alertaProduccion ? 'red' : 'transparent',
              }}
            >
              <td>{reserva.productoNombre}</td>
              <td>{reserva.toneladasReservadas}</td>
              <td>{reserva.stockDisponible}</td>
              <td>{reserva.alertaProduccion ? '⚠️ Alerta' : 'Sin alerta'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      ) :( <p className="noProductos">No hay reservas disponibles.</p>)}
    </div>
  );
};

export default ReservasProximaSemana;
