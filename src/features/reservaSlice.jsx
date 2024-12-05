import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reservas: []
};

const reservaSlice = createSlice({
  name: 'reserva',
  initialState,
  reducers: {
    registarReservas: (state, action) => {
      state.reservas.push(action.payload);
    }
  }
});

export const { registarReservas } = reservaSlice.actions;

export default reservaSlice.reducer;