import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import productoReducer from "./features/productoSlice"
import reservaReducer from "./features/reservaSlice"
import pedidoReducer from "./features/pedidoSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    productos: productoReducer,
    reserva: reservaReducer,
    pedido: pedidoReducer,
  },
});
