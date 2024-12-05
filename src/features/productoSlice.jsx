import { createSlice } from '@reduxjs/toolkit';

const productosSlice = createSlice({
  name: 'productos',
  initialState: {
    productos: [],
  },
  reducers: {
    setProductos: (state, action) => {
      state.productos = action.payload;
    },
  },
});

export const { setProductos } = productosSlice.actions;
export default productosSlice.reducer;