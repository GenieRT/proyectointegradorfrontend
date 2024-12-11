import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistrarPedido from "./components/RegistroPedido";
import Login from "./components/Login";
import Registro from "./components/Registro";
import RegistroReserva from "./components/RegistroReserva";
import ListaProductos from "./components/ListaProductos"
import AprobarPedido from "./components/AprobarPedido";
import Logout from "./components/Logout"; 
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/authSlice";

function App() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  console.log("isAuthenticated:", isAuthenticated);
  console.log("role:", role);


  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login"; // Redirige al usuario al login después de cerrar sesión
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestión de Pedidos ISUSA</h1>
          {/* Barra de navegación */}
          <nav>
            <ul style={{ display: "flex", gap: "10px", listStyle: "none" }}>
              {!isAuthenticated && (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/registro">Registro</Link>
                  </li>
                </>
              )}
              {isAuthenticated && role === "Empleado" && (
                
                <>
                  <li>
                    <Link to="/aprobarPedido">Aprobar pedido</Link>
                  </li>
                  <li>
                    <Link to="/productos">Productos</Link>
                  </li>

                </>
              )}
              {isAuthenticated && role === "Cliente" && (
                <>
                  <li>
                    <Link to="/registrarPedido">Registrar pedido</Link>
                  </li>
                  <li>
                    <Link to="/registrarReserva">Registrar reserva</Link>
                  </li>
                  <li>
                    <Link to="/productos">Productos</Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <li>
                  <button onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registrarPedido" element={<RegistrarPedido />} />
            <Route path="/aprobarPedido" element={<AprobarPedido />} />
            <Route path="/registrarReserva" element={<RegistroReserva pedidoId={2} clienteId={1} />} />
            <Route path="/productos" element={<ListaProductos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );


  /* return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestión de Pedidos ISUSA</h1>
          <nav>
            <ul style={{ display: "flex", gap: "10px", listStyle: "none" }}>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/registro">Registro</Link>
              </li>
              <li>
                <Link to="/registrarPedido">Registrar pedido</Link>
              </li>
              <li>
                <Link to="/aprobarPedido">Aprobar pedido</Link>
              </li>
              <li>
                <Link to="/registrarReserva">Registrar reserva por ahora porque no está terminado y solo te lleva a un pedido en especifico</Link>
              </li>
              <li>
                <Link to="/productos">Productos sin filtro por tipo de Usuario</Link>
              </li>
              <li>
                <Logout />
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registrarPedido" element={<RegistrarPedido />} />
            <Route path="/aprobarPedido" element={<AprobarPedido />} />
            <Route path="/registrarReserva" element={<RegistroReserva pedidoId={2} clienteId={1} />} />
            <Route path="/productos" element={<ListaProductos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );*/
}

export default App;
