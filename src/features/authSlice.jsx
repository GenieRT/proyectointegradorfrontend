import { createSlice } from "@reduxjs/toolkit";

// Estado inicial
const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload); // Guardar en localStorage
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token"); // Limpiar localStorage
    },
  },
});

// Acciones exportables
export const { setToken, logout } = authSlice.actions;

// Reducer exportable
export default authSlice.reducer;
