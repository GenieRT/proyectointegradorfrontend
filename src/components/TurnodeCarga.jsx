import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registrarTurno } from '../features/turnoSlice';

const TurnodeCarga = () => {
  const dispatch = useDispatch();

  // Estado para el formulario
  const [fecha, setFecha] = useState('');
  const [toneladas, setToneladas] = useState('');

  // Función para registrar el turno de carga
  const handleRegistrarTurno = async () => {
    // Validación básica de datos
    if (!fecha || !toneladas || isNaN(toneladas) || toneladas <= 0) {
      alert('Por favor, complete todos los campos con valores válidos.');
      return;
    }

    // Convertir la fecha al formato ISO 8601
    const fechaISO = new Date(fecha).toISOString();

    // Creación del objeto turno
    const turno = {
      fecha: fechaISO,
      toneladas: parseFloat(toneladas), // Convertir a número
    };

    try {
      console.log('Enviando datos al backend:', turno);

      const response = await fetch('https://isusawebapi.azurewebsites.net/api/v1/TurnosCarga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(turno),
      });

      console.log('Estado de la respuesta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en el servidor: ${errorText}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      dispatch(registrarTurno(data));
      alert('Turno registrado exitosamente.');
      setFecha('');
      setToneladas('');
    } catch (error) {
      console.error('Error al registrar el turno:', error);
      alert(`Error al registrar el turno: ${error.message}`);
    }
  };

  return (
    <form>
      <h2>Registrar Turno de Carga</h2>

      {/* Campo de Fecha */}
      <label>
        Fecha de carga:
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </label>

      {/* Campo de Toneladas */}
      <label>
        Toneladas:
        <input
          type="number"
          min="0"
          step="0.01"
          value={toneladas}
          onChange={(e) => setToneladas(e.target.value)}
          required
        />
      </label>

      {/* Botón para registrar */}
      <button type="button" onClick={handleRegistrarTurno}>
        Registrar turno
      </button>
    </form>
  );
};

export default TurnodeCarga;
