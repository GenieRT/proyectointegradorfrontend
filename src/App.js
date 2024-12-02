import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrarPedido from './components/RegistroPedido';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Gestión de Pedidos</h1>
        </header>
        <main>
          <Routes>
            {/* Ruta principal para el registro de pedidos */}
            <Route path="/" element={<RegistrarPedido />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
