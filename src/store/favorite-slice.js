import { createSlice } from '@reduxjs/toolkit';
import { indexOf, map } from 'lodash';
import { auth, database } from 'util/firebase';
import { ref, onValue, set } from 'firebase/database';
import { uiActions } from 'store/ui-slice';

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    itemList: [],
  },
  reducers: {
    setItemList(state, action) {
      state.itemList = action.payload;
    },
    toggleFav(state, action) {
      if (action.payload.type === 'add') {
        state.itemList.push(action.payload.showId);
      } else {
        const matchIndex = indexOf(state.itemList, action.payload.showId);
        state.itemList.splice(matchIndex, 1);
      }
    },
  },
});

export const favoriteActions = favoriteSlice.actions;

export default favoriteSlice;

export const getFavList = () => {
  return async (dispatch) => {
    onValue(ref(database, `/favoriteList/${auth.currentUser.uid}`),
      (snapshot) => {
        const list = map(snapshot.val(), (value, showId) => showId);
        dispatch(
          favoriteActions.setItemList(list)
        );
      },
      ()=> {
        dispatch(
          uiActions.addNotification({
            type: 'error',
          })
        );
      },
      { onlyOnce: true },
    );
  };
};

export const toggleFav = ({ type, showId }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    set(ref(database, `/favoriteList/${auth.currentUser.uid}/${showId}`), type === 'add' ? true : null)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
      .then(() => {
        dispatch(
          favoriteActions.toggleFav({ type, showId })
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: type === 'remove' ? '已取消收藏' : '已加入收藏',
          })
        );
      })
      .catch(() => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
          })
        );
      });
  };
};
