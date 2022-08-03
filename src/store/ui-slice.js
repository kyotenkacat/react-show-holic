import { createSlice } from '@reduxjs/toolkit';
import { errorCode } from 'asset/errorCode';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    loading: false,
    notificationList: [],
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    addNotification(state, action) {
      let message = action.payload.message;
      if (action.payload.type === 'error') {
        message = errorCode[action.payload.errorCode] || '發生錯誤，請稍候再重試';
      }
      state.notificationList.push({
        id: Date.now(),
        type: action.payload.type,
        message,
      });
    },
    removeNotification(state, action) {
      state.notificationList.splice(action.payload, 1);
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
