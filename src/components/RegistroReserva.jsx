import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registarReservas} from '../features/reservaSlice';

const RegistroReserva = ({ pedidoId, clienteId }) => {
    const dispatch = useDispatch();
    const [pedido, setPedido] = useState(null);
    const [productosDetalles, setProductosDetalles] = useState([]);
    const [fecha, setFecha] = useState('');
    const [camion, setCamion] = useState('');
    const [chofer, setChofer] = useState('');
    const [lineasReservas, setLineasReservas] = useState([]);
  
    const token = localStorage.getItem("token");

    // Fetch para obtener el pedido por ID y sus líneas
    useEffect(() => {
      if (pedidoId) {
        fetch(`http://localhost:5183/api/v1/Pedido/${pedidoId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setPedido(data);
  
            // Obtener los productos asociados a las líneas del pedido
            Promise.all(
              data.productos.map((linea) =>
                fetch(`http://localhost:5183/api/v1/Producto/${linea.productoId}`) //nose si hay que agregar meter el token aca
                  .then((response) => response.json())
                  .then((producto) => ({
                    ...producto,
                    cantidadOrdenada: linea.cantidad, // Añadir la cantidad ordenada desde las líneas
                  }))
                  .catch((error) => {
                    console.error('Error al obtener el producto', error);
                    return null;
                  })
              )
            ).then((productos) => setProductosDetalles(productos.filter((p) => p))); // Se filtran nulos
          })
          .catch((error) => {
            console.error('Error al obtener el pedido', error);
          });
      }
    }, [pedidoId]);
  
    // Función para registrar la reserva cuando se presiona el botón
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
  
        fetch('http://localhost:5183/api/v1/Reserva', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reserva),
        })
          .then((response) => response.json())
          .then((data) => {
            dispatch(registarReservas(data));
            alert('Reserva registrada exitosamente.');
          })
          .catch((error) => {
            console.error('Error al registrar la reserva', error);
            alert('Error al registrar la reserva');
          });
      } else {
        alert('Por favor, complete todos los campos.');
      }
    };
  
    const handleAddLineaReserva = (productoId, cantidadReservada) => {
        setLineasReservas((prev) => {
          // Verificar si ya existe una línea de reserva para este producto
          const lineaExistente = prev.find((linea) => linea.productoId === productoId);
      
          if (lineaExistente) {
            // Actualizamos la cantidad reservada de la línea existente
            return prev.map((linea) =>
              linea.productoId === productoId
                ? { ...linea, cantidadReservada: cantidadReservada }
                : linea
            );
          } else {
            // Agregamos una nueva línea si no existe
            const nuevaLinea = { productoId, cantidadReservada };
            return [...prev, nuevaLinea];
          }
        });
      };
  
    if (!pedido) return <div>Cargando pedido...</div>;
  
    return (
      <form>
        <h2>Registrar Reserva</h2>
  
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
  
        {/* Campo de Matrícula del Camión */}
        <label>
          Matrícula del camión:
          <input
            type="text"
            value={camion}
            onChange={(e) => setCamion(e.target.value)}
            required
          />
        </label>
  
        {/* Campo de Chofer */}
        <label>
          Nombre del chofer:
          <input
            type="text"
            value={chofer}
            onChange={(e) => setChofer(e.target.value)}
            required
          />
        </label>
  
        {/* Selección de productos y cantidad a cargar */}
        <h3>Productos del Pedido</h3>
        {productosDetalles && productosDetalles.length > 0 ? (
          productosDetalles.map((producto) => (
            <div key={producto.id}>
            <span>
              {producto.descripcion} (Cantidad ordenada: {producto.cantidadOrdenada})
            </span>
            <input
              type="number"
              min="1"
              max={producto.cantidadOrdenada}
              placeholder="Toneladas a cargar"
              onChange={(e) => {
                const cantidad = parseInt(e.target.value, 10);
                if (cantidad > 0 && cantidad <= producto.cantidadOrdenada) {
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
  
        <button type="button" onClick={handleRegistrarReserva}>
          Registrar Reserva
        </button>
      </form>
    );
  };
  
  export default RegistroReserva;