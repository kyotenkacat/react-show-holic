import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartIsVisible: false,
    notificationList: []
  },
  reducers: {
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
    addNotification(state, action) {
      state.notificationList.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification(state, action) {
      state.notificationList.splice(action.payload, 1);
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
