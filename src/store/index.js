import { configureStore } from '@reduxjs/toolkit';

import uiSlice from './ui-slice';
import favoriteSlice from './favorite-slice';
import cartSlice from './cart-slice';

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    favorite: favoriteSlice.reducer,
    cart: cartSlice.reducer
  },
});

export default store;
