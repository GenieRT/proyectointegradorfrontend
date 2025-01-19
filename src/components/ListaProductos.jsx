import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProductos } from '../features/productoSlice';

const ProductosTabla = () => {
  const dispatch = useDispatch();
  const { productos } = useSelector((state) => state.productos);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetch('https://localhost:7218/api/v1/Producto', {
      //method: "GET", //por defecto es get
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setProductos(data)); // Guardamos los productos en el estado
      })
      .catch((error) => {
        console.error('Error al obtener los productos', error);
      });
  }, [dispatch]);
  return (
    <div>
      <h2>Listado de Productos</h2>
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Stock Disponible</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.descripcion}</td>
              <td>{producto.stockDisponible}</td>
              <td>{producto.costo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosTabla;