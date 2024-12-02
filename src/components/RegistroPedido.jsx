import React, { useState, useEffect, useRef } from 'react';

const RegistrarPedido = () => {
    const [productos, setProductos] = useState([]); // Productos obtenidos de la API
    const [presentaciones, setPresentaciones] = useState([]); // Presentaciones obtenidas de la API
    const [productosSeleccionados, setProductosSeleccionados] = useState([]); // Lista de productos seleccionados con presentaciones
    const [clienteId] = useState(6); // Cliente ID (cambiarlo dinámicamente)
  
    // Obtener productos y presentaciones al cargar el componente
    useEffect(() => {
      fetch('http://localhost:5183/api/v1/Producto')
        .then((response) => response.json())
        .then((data) => setProductos(data))
        .catch((error) => console.error('Error al obtener productos:', error));
  
      fetch('http://localhost:5183/api/v1/Presentacion')
        .then((response) => response.json())
        .then((data) => setPresentaciones(data))
        .catch((error) => console.error('Error al obtener presentaciones:', error));
    }, []);
  
    const handleAgregarProducto = () => {
      setProductosSeleccionados([
        ...productosSeleccionados,
        { productoId: '', presentacionId: '', cantidad: '' },
      ]);
    };
  
    const handleProductoChange = (index, field, value) => {
      const nuevosProductosSeleccionados = [...productosSeleccionados];
      nuevosProductosSeleccionados[index][field] = value;
      setProductosSeleccionados(nuevosProductosSeleccionados);
    };
  
    const registrarPedidoAPI = () => {
        const fecha = new Date().toISOString(); 
  
      if (productosSeleccionados.some(p => !p.productoId || !p.presentacionId || !p.cantidad)) {
        alert('Por favor complete todos los campos');
        return;
      }
  
      const pedido = {
        fecha,
        estado: 'Pendiente',
        productos: productosSeleccionados.map((p) => ({
          productoId: parseInt(p.productoId),
          presentacionId: parseInt(p.presentacionId),
          cantidad: parseInt(p.cantidad),
        })),
        clienteId,
      };

      console.log(pedido);
  
      fetch('http://localhost:5183/api/v1/Pedido', {
        method: 'POST',
        body: JSON.stringify(pedido),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (response.ok) {
            alert('Pedido registrado con éxito');
          } else {
            alert('Error al registrar el pedido');
          }
        })
        .catch((error) => {
          console.error('Error al registrar el pedido:', error);
          alert('Hubo un error al registrar el pedido');
        });
    };
  
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">Registrar Pedido</div>
              <div className="card-body">
                {productosSeleccionados.map((producto, index) => (
                  <div key={index} className="border p-3 mt-3">
                    <div className="form-group">
                      <label>Producto</label>
                      <select
                        className="form-control"
                        value={producto.productoId}
                        onChange={(e) => handleProductoChange(index, 'productoId', e.target.value)}
                      >
                        <option value="">Seleccione un producto</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Presentación</label>
                      <select
                        className="form-control"
                        value={producto.presentacionId}
                        onChange={(e) => handleProductoChange(index, 'presentacionId', e.target.value)}
                      >
                        <option value="">Seleccione una presentación</option>
                        {presentaciones.map((pr) => (
                          <option key={pr.id} value={pr.id}>
                            {pr.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        className="form-control"
                        value={producto.cantidad}
                        onChange={(e) => handleProductoChange(index, 'cantidad', e.target.value)}
                        placeholder="Ingrese la cantidad"
                      />
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-success mt-3" onClick={handleAgregarProducto}>
                  Agregar Producto
                </button>
                <button type="button" className="btn btn-primary mt-3" onClick={registrarPedidoAPI}>
                  Registrar Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default RegistrarPedido;
