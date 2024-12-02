import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pedidos: []
};

const pedidoSlice = createSlice({
  name: 'pedido',
  initialState,
  reducers: {
    registrarPedido: (state, action) => {
      state.pedidos.push(action.payload);
    }
  }
});

export const { registrarPedido } = pedidoSlice.actions;

export default pedidoSlice.reducer;