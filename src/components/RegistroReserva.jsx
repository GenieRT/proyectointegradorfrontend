import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registarReservas} from '../features/reservaSlice';
import { useLocation } from "react-router-dom";

const RegistroReserva = () => {
  const dispatch = useDispatch();
  const [pedido, setPedido] = useState(null);
  const [productosDetalles, setProductosDetalles] = useState([]);
  const [fecha, setFecha] = useState('');
  const [camion, setCamion] = useState('');
  const [chofer, setChofer] = useState('');
  const [lineasReservas, setLineasReservas] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null); // Para manejar errores
  const [productoReservadoId, setProductoReservadoId] = useState(null); // Nuevo estado
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pedidoId = queryParams.get("pedidoId");
  const clienteId = localStorage.getItem("clienteId");
  const token = localStorage.getItem("token");

//limpiar mensajes
  //----------------------------------------------------------------------------
  const limpiarMensajes = () => {
    setTimeout(() => {
      setError(null);
      setSuccessMessage("");
    }, 3000); // Los mensajes desaparecerán después de 3 segundos
  }
//----------------------------------------------------------------------------------
  

  useEffect(() => {
    if (pedidoId) {
      fetch(`https://isusawebapi.azurewebsites.net/api/v1/Pedido/${pedidoId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setPedido(data);
          Promise.all(
            data.productos.map((linea) =>
              fetch(`https://isusawebapi.azurewebsites.net/api/v1/Producto/${linea.productoId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((response) => response.json())
                .then((producto) => ({
                  ...producto,
                  cantidadRestante: linea.cantidadRestante,
                }))
            )
          ).then((productos) => setProductosDetalles(productos.filter((p) => p)));
        })
        .catch((error) => {
          console.error('Error al obtener el pedido', error);
        });
    }
  }, [pedidoId]);

  const handleRegistrarReserva = () => {
    if (fecha && camion && chofer && lineasReservas.length > 0) {
      const reserva = {
        fecha,
        pedidoId,
        clienteId,
        camion,
        chofer,
        lineasReservas,
      };

      fetch('https://isusawebapi.azurewebsites.net/api/v1/Reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(reserva),
      })
        .then(async (response) => {
          let data;
          try {
            data = await response.json();
          } catch {
            data = {};
          }

          if (response.ok) {
            setSuccessMessage(data.message || 'Reserva registrada exitosamente.');
            setError('');
            limpiarMensajes();
            dispatch(registarReservas(data));
          } else {
            setError(data.message || 'Error al registrar la reserva.');
            setSuccessMessage('');
            limpiarMensajes();
          }
        })
        .catch((error) => {
          console.error('Error al registrar la reserva', error.message);
          setError('Error inesperado al registrar la reserva.');
          setSuccessMessage('');
          limpiarMensajes();
        });
    } else {
      setError('Por favor, complete todos los campos.');
      setSuccessMessage('');
      limpiarMensajes();
    }
  };

  const handleAddLineaReserva = (productoId, cantidadRestante) => {
    if (productoReservadoId && productoReservadoId !== productoId) {
      alert('Solo se puede reservar un producto por pedido.');
      return;
    }

    setLineasReservas([{ productoId, cantidadRestante }]);
    setProductoReservadoId(productoId); // Registrar el producto reservado
  };

  if (!pedido) return <div>Cargando pedido...</div>;

  return (
    <form>
      <h2>Registrar Reserva</h2>

      <label>
        Fecha de carga:
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </label>

      <label>
        Matrícula del camión:
        <input
          type="text"
          value={camion}
          onChange={(e) => setCamion(e.target.value)}
          required
        />
      </label>

      <label>
        Nombre del chofer:
        <input
          type="text"
          value={chofer}
          onChange={(e) => setChofer(e.target.value)}
          required
        />
      </label>

      <h3>Productos del Pedido</h3>
      {productosDetalles && productosDetalles.length > 0 ? (
        productosDetalles.map((producto) => (
          <div key={producto.id}>
            <span>
              {producto.descripcion} (Cantidad Restante: {producto.cantidadRestante})
            </span>
            <input
              type="number"
              min="1"
              max={producto.cantidadOrdenada}
              placeholder="Toneladas a cargar"
              disabled={productoReservadoId && productoReservadoId !== producto.id} // Deshabilitar si otro producto ya fue reservado
              onChange={(e) => {
                const cantidad = parseInt(e.target.value, 10);
                if (cantidad > 0 && cantidad <= producto.cantidadRestante) {
                  handleAddLineaReserva(producto.id, cantidad);
                } else {
                  alert('Ingrese un valor válido.');
                }
              }}
            />
          </div>
        ))
      ) : (
        <p>No hay productos disponibles en este pedido.</p>
      )}

      <div>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      <button type="button" onClick={handleRegistrarReserva}>
        Registrar Reserva
      </button>
    </form>
  );
};
  
  export default RegistroReserva;