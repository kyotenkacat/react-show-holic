import { configureStore } from '@reduxjs/toolkit';

import uiSlice from './ui-slice';
import showSlice from './show-slice';
import authSlice from './auth-slice';
import favoriteSlice from './favorite-slice';
import playListSlice from './playList-slice';
import cartSlice from './cart-slice';

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    show: showSlice.reducer,
    auth: authSlice.reducer,
    favorite: favoriteSlice.reducer,
    playList: playListSlice.reducer,
    cart: cartSlice.reducer
  },
});

export default store;
