import React, { useState, useEffect } from 'react';

const RegistrarPedido = () => {
  const [productos, setProductos] = useState([]); // Productos obtenidos de la API
  const [presentaciones, setPresentaciones] = useState([]); // Presentaciones obtenidas de la API
  const [productosSeleccionados, setProductosSeleccionados] = useState([]); // Lista de productos seleccionados con presentaciones
  const [nuevoProducto, setNuevoProducto] = useState({
    productoId: '',
    presentacionId: '',
    cantidad: '',
  }); // Formulario para un nuevo producto
  const [clienteId] = useState(1); // Cliente ID (cambiarlo dinámicamente)
  const token = localStorage.getItem("token");

  // Obtener productos y presentaciones al cargar el componente
  useEffect(() => {
    fetch('http://localhost:5183/api/v1/Producto', {
     // method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al obtener productos:', error));

    fetch('http://localhost:5183/api/v1/Presentacion', {
     // method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPresentaciones(data))
      .catch((error) => console.error('Error al obtener presentaciones:', error));
  }, []);

  const handleNuevoProductoChange = (field, value) => {
    setNuevoProducto({ ...nuevoProducto, [field]: value });
  };

  const handleAgregarProducto = () => {
    if (!nuevoProducto.productoId || !nuevoProducto.presentacionId || !nuevoProducto.cantidad) {
      alert('Por favor complete todos los campos antes de agregar el producto.');
      return;
    }

    setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
    setNuevoProducto({ productoId: '', presentacionId: '', cantidad: '' }); // Limpiar el formulario
  };

  const handleEliminarProducto = (index) => {
    const nuevosProductosSeleccionados = [...productosSeleccionados];
    nuevosProductosSeleccionados.splice(index, 1);
    setProductosSeleccionados(nuevosProductosSeleccionados);
  };

  const registrarPedidoAPI = () => {
    //const fecha = new Date().toISOString();

    if (productosSeleccionados.length === 0) {
      alert('Debe agregar al menos un producto antes de realizar el pedido.');
      return;
    }

    const pedido = {
      productos: productosSeleccionados.map((p) => ({
        productoId: parseInt(p.productoId),
        presentacionId: parseInt(p.presentacionId),
        cantidad: parseInt(p.cantidad),
      })),
      clienteId,
    };

    fetch('http://localhost:5183/api/v1/Pedido', {
      method: 'POST',
      body: JSON.stringify(pedido),
      headers: { 
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          alert('Pedido registrado con éxito');
          setProductosSeleccionados([]); // Limpia el carrito después de hacer el pedido
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
              <div className="border p-3">
                <h5>Agregar Producto</h5>
                <div className="form-group">
                  <label>Producto</label>
                  <select
                    className="form-control"
                    value={nuevoProducto.productoId}
                    onChange={(e) => handleNuevoProductoChange('productoId', e.target.value)}
                  >
                    <option value="">Seleccione un producto</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Presentación</label>
                  <select
                    className="form-control"
                    value={nuevoProducto.presentacionId}
                    onChange={(e) => handleNuevoProductoChange('presentacionId', e.target.value)}
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
                    value={nuevoProducto.cantidad}
                    onChange={(e) => handleNuevoProductoChange('cantidad', e.target.value)}
                    placeholder="Ingrese la cantidad"
                  />
                </div>
                <button type="button" className="btn btn-success mt-3" onClick={handleAgregarProducto}>
                  Agregar Producto
                </button>
              </div>
              {productosSeleccionados.length > 0 && (
                <div className="mt-4">
                  <h5>Productos Seleccionados</h5>
                  <ul className="list-group">
                    {productosSeleccionados.map((producto, index) => {
                      const productoInfo = productos.find((p) => p.id === parseInt(producto.productoId));
                      const presentacionInfo = presentaciones.find(
                        (pr) => pr.id === parseInt(producto.presentacionId)
                      );
                      return (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {productoInfo?.descripcion || 'Producto no seleccionado'} -{' '}
                          {presentacionInfo?.descripcion || 'Presentación no seleccionada'} -{' '}
                          {producto.cantidad || 'Cantidad no ingresada'}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminarProducto(index)}
                          >
                            Eliminar
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={registrarPedidoAPI}
                  >
                    Hacer Pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrarPedido;
