import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  turnos: [], // Lista de turnos de carga
};

const turnosSlice = createSlice({
  name: 'turnos',
  initialState,
  reducers: {
    setTurnos: (state, action) => {
      state.turnos = action.payload; // Establece la lista de turnos
    },
    registrarTurno: (state, action) => {
      state.turnos.push(action.payload); // Añadir un nuevo turno a la lista
    },
  },
});

export const { setTurnos, registrarTurno } = turnosSlice.actions;

export default turnosSlice.reducer;
