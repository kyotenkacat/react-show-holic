import { createSlice } from '@reduxjs/toolkit';
import { findIndex, find, forEach } from 'lodash';
import { auth, database } from 'util/firebase';
import { ref, onValue, set, update } from 'firebase/database';
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
        state.itemList.push({
          showId: action.payload.showId,
          favRating: 0,
          favComment: '',
        });
      } else {
        const matchIndex = findIndex(state.itemList, ['showId', action.payload.showId]);
        state.itemList.splice(matchIndex, 1);
      }
    },
    updateReview(state, action) {
      const match = find(state.itemList, ['showId', action.payload.showId]);
      match.favRating = action.payload.favRating;
      match.favComment = action.payload.favComment;
    },
  },
});

export const favoriteActions = favoriteSlice.actions;

export default favoriteSlice;

export const getFavList = () => {
  return async (dispatch) => {
    onValue(ref(database, `/favoriteList/${auth.currentUser.uid}`),
      (snapshot) => {
        console.log('getFavList snapshot.val():', snapshot.val())
        const favList = [];
        forEach(snapshot.val(), (item, showId) => {
          favList.push({
            showId,
            favRating: item.favRating,
            favComment: item.favComment,
          });
        })
        dispatch(
          favoriteActions.setItemList(favList)
        );
      },
      (error)=> {
        console.log('error:', error)
      },
      { onlyOnce: true },
    );
  };
}

export const toggleFav = ({ type, showId }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    let data = null;
    if (type === 'add') {
      data = {
        favRating: 0,
        favComment: '',
      };
    }
    
    set(ref(database, `/favoriteList/${auth.currentUser.uid}/${showId}`), data)
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
      }).catch((error) => {
        console.error(error);
      });
  };
}

export const updateReview = ({ showId, favRating, favComment }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const data = { favRating, favComment };
    update(ref(database, `/favoriteList/${auth.currentUser.uid}/${showId}`), data)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
      .then(() => {
        dispatch(
          favoriteActions.updateReview({ showId, favRating, favComment })
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已儲存',
          })
        );
      }).catch((error) => {
        console.error(error);
      });
  };
}