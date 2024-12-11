import { createSlice } from "@reduxjs/toolkit";

// Estado inicial
const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  role: localStorage.getItem("role") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token); // Guardar en localStorage
      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem("token"); // Limpiar localStorage
      localStorage.removeItem("role"); // Limpiar localStorage
    },
  },
});

// Acciones exportables
export const { setToken, logout } = authSlice.actions;

// Reducer exportable
export default authSlice.reducer;
