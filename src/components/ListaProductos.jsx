import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProductos } from '../features/productoSlice';
import BASE_URL from "../apiConfig";


const ProductosTabla = () => {
  const dispatch = useDispatch();
  const { productos } = useSelector((state) => state.productos);
  const { token, role } = useSelector((state) => state.auth); // rol indica si es cliente o empleado




  
  useEffect(() => {
    fetch(`${BASE_URL}/v1/Producto`, {
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
        
      });
  }, [dispatch, token]);

  return (
    <div>
      <h2>Listado de Productos</h2>
      {productos.length > 0 ? (
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>Descripción</th>
            {role === 'Empleado' && <th>Stock Disponible</th>}
            {role === 'Cliente' && <th>Precio</th>}
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.descripcion}</td>
              {role === 'Empleado' && <td>{producto.stockDisponible}</td>}
              {role === 'Cliente' && <td>{producto.costo}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      ): (
        <p>No hay productos disponibles</p>
      )}
    </div>
  );
};

export default ProductosTabla;