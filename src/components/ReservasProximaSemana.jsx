import React, { useState, useEffect } from 'react';

const ReservasProximaSemana = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5183/api/v1/Reserva/ReservasSemanaProxima')
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
        setError('No se pudieron cargar las reservas. Intente nuevamente más tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Cargando reservas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Reservas de la próxima semana</h2>
      <table>
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
    </div>
  );
};

export default ReservasProximaSemana;
