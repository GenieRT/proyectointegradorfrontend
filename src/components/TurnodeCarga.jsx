import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registrarTurno } from '../features/turnoSlice';
import BASE_URL from '../apiConfig';
import '../styles/Message.css';
import "../styles/TablasYFormularios.css"

const TurnodeCarga = () => {
  const dispatch = useDispatch();

  // Estado para el formulario
  const [fechaInicioSemana, setFecha] = useState('');
  const [fechaFinSemana, setFecha2] = useState('');
  const [toneladas, setToneladas] = useState('');
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [error, setError] = useState(null);


//limpiar mensajes
  //----------------------------------------------------------------------------
  const limpiarMensajes = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage("");
    }, 5000); // Los mensajes desaparecerán después de 3 segundos
  }
//----------------------------------------------------------------------------------

  // Función para registrar el turno de carga
  const handleRegistrarTurno = async () => {
    const fechaActual = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD
    // Validación básica de datos
     if (!fechaInicioSemana || !fechaFinSemana || !toneladas || isNaN(toneladas) || toneladas <= 0) {
      setError('Por favor, complete todos los campos con valores válidos.');
      limpiarMensajes();
      return;
    } 
    else if (fechaInicioSemana < fechaActual) {
      setError("La fecha de inicio no puede ser menor a la fecha actual.");
      limpiarMensajes();
      return;
    } 
    else if(fechaFinSemana<fechaInicioSemana){
        
      setError('La fecha de finalización debe ser mayor a la de inicio');
       limpiarMensajes();
       return;
}
    // Convertir la fecha al formato ISO 8601

    const fechaInicioISO = new Date(fechaInicioSemana).toISOString();
    const fechaFinISO = new Date(fechaFinSemana).toISOString();

    const token = localStorage.getItem("token");
    // Creación del objeto turno
    const turno = {
      fechaInicioSemana: fechaInicioISO,
      fechaFinSemana: fechaFinISO,
      toneladas: parseFloat(toneladas), // Convertir a número
    };

    try {
      

      const response = await fetch(`${BASE_URL}/v1/TurnosCarga`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },

        body: JSON.stringify(turno),
      });

     

      if (!response.ok) {
    
        const errorText = await response.text();
        throw new Error(`Error en el servidor: ${errorText}`);
      }

      const data = await response.json();
      

      dispatch(registrarTurno(data));
      setSuccessMessage("Registro de turno exitoso.");
      limpiarMensajes();
      setFecha('');
      setFecha2('');
      setToneladas('');
    } catch (error) {
      console.error("Mensjae del error:", error.message);
      setError(error.message); // Mostrar el error al usuario
      limpiarMensajes();
    }
  };

  return (
    <div className='container'>
    <form>
      <h2 className='title' >Registrar Turno de Carga</h2>

      {/* Campo de Fecha */}
      <label>
        Fecha de inicio de Semana:
        <input
          type="date"
          value={fechaInicioSemana}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </label>


      {/* Campo de Fecha2 */}
      <label>
        Fecha de fin de Semana:
        <input
          type="date"
          value={fechaFinSemana}
          onChange={(e) => setFecha2(e.target.value)}
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
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Botón para registrar */}
      <button type="button" onClick={handleRegistrarTurno}>
        Registrar turno
      </button>
    </form>
    </div>
  );
};

export default TurnodeCarga;
