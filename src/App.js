import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegistrarPedido from "./components/RegistroPedido";
import Login from "./components/Login";
import Registro from "./components/Registro";
import RegistroReserva from "./components/RegistroReserva";
import ListaProductos from "./components/ListaProductos"

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestión de Pedidos ISUSA</h1>
          {/* Barra de navegación */}
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
                <Link to="/registrarReserva">Registrar reserva por ahora porque no está terminado y solo te lleva a un pedido en especifico</Link>
              </li>
              <li>
                <Link to="/productos">Productos sin filtro por tipo de Usuario</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/registrarPedido" element={<RegistrarPedido />} />
            <Route path="/registrarReserva" element={<RegistroReserva pedidoId={2} clienteId={1} />} />
            <Route path="/productos" element={<ListaProductos />} />
          </Routes>
        </main>
      </div>
    </Router>

    /*<Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestión de Pedidos</h1>
        </header>
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            <Route path="/" element={<RegistrarPedido />} />
            <Route path="/reserva" element ={<RegistroReserva pedidoId={2} clienteId={1} />}/>
            <Route path="/productos" element ={<ListaProductos />}/>
          </Routes>
        </main>
      </div>
    </Router> 
*/    
  );
}

export default App;
