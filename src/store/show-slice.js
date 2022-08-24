import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from 'store/ui-slice';
import { ref, onValue, push, set, update } from 'firebase/database';
import { auth, database } from 'util/firebase';
import { forEach, map } from 'lodash';

const showSlice = createSlice({
  name: 'show',
  initialState: {
    itemList: [],
  },
  reducers: {
    setItemList(state, action) {
      state.itemList = action.payload;
    },
  },
});

export const showActions = showSlice.actions;

export default showSlice;

export const getShowList = () => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    onValue(ref(database, '/showList'),
      (snapshot) => {
        const showList = [];
        forEach(snapshot.val(), (item, showId) => {
          showList.push({
            id: showId,
            ...item,
          });
        });
        dispatch(
          showActions.setItemList(showList)
        );
        dispatch(
          uiActions.setLoading(false)
        );
      },
      ()=> {
        dispatch(
          uiActions.setLoading(false)
        );
        dispatch(
          uiActions.addNotification({
            type: 'error',
          })
        );
      },
      { onlyOnce: true }
    );
  };
};

export const getShowReviewList = (showId, setReviewList) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    onValue(ref(database, `/showReview/${showId}`),
      (snapshot) => {
        const reviewList = map(snapshot.val(), (value, id) => ({
          id,
          rating: value.rating,
          comment: value.comment,
          uid: value.uid,
        }));
        setReviewList(reviewList);
        dispatch(
          uiActions.setLoading(false)
        );
      },
      ()=> {
        dispatch(
          uiActions.setLoading(false)
        );
        dispatch(
          uiActions.addNotification({
            type: 'error',
          })
        );
      },
      { onlyOnce: true }
    );
  };
};

export const addReview = ({ showId, rating, comment }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const showReviewRef = ref(database, `/showReview/${showId}`);
    const newReviewRef = push(showReviewRef);
    const data = {
      uid: auth.currentUser.uid,
      rating,
      comment,
    };
    set(newReviewRef, data)
      .then(() => {
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已新增',
          })
        );
      })
      .catch(() => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
          })
        );
      })
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      });
  };
};

export const updateReview = ({ showId, reviewId, rating, comment }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const data = { rating, comment };
    update(ref(database, `/showReview/${showId}/${reviewId}`), data)
      .then(() => {
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已儲存',
          })
        );
      })
      .catch(() => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
          })
        );
      })
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      });
  };
};
