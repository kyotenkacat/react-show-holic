import { createSlice } from '@reduxjs/toolkit';
import { findIndex, find, forEach } from 'lodash';
import { auth, database } from 'util/firebase';
import {
  ref, onValue, query, orderByChild, equalTo,
  push, set, update
} from 'firebase/database';
import { uiActions } from 'store/ui-slice';

const playListSlice = createSlice({
  name: 'playList',
  initialState: {
    // itemList: [
    //   {
    //     id: 1,
    //     title: '夏日浪漫戀曲',
    //     description: '在熱熱的夏天談場酸酸甜甜的戀愛',
    //     showIdList: ['tt5788792'],
    //   },
    // ],
    itemList: [],
  },
  reducers: {
    setItemList(state, action) {
      state.itemList = action.payload;
    },
    addPlayList(state, action) {
      state.itemList.push(action.payload);
    },
    updatePlayList(state, action) {
      const match = find(state.itemList, ['id', action.payload.id]);
      match.title = action.payload.title;
      match.description = action.payload.description;
    },
    deletePlayList(state, action) {
      const matchIndex = findIndex(state.itemList, ['id', action.payload.id]);
      state.itemList.splice(matchIndex, 1);
    },
    toggleShow(state, action) {
      const match = find(state.itemList, ['id', action.payload.id]);
      if (action.payload.type === 'add') {
        match.showIdList.push(action.payload.showId);
      } else {
        const matchShowIndex = findIndex(match.showIdList, ['id', action.payload.showId]);
        match.showIdList.splice(matchShowIndex, 1);
      }
    },
  },
});

export const playListActions = playListSlice.actions;

export default playListSlice;

export const getPlayList = () => {
  return async (dispatch) => {
    onValue(query(ref(database, `/playList`), orderByChild('ownerUid'), equalTo(auth.currentUser.uid)),
      (snapshot) => {
        console.log('getPlayList snapshot.val():', snapshot.val())
        const playList = [];
        forEach(snapshot.val(), (item, id) => {
          playList.push({
            id,
            title: item.title,
            description: item.description,
            showIdList: item.showIdList ? item.showIdList.split(',') : [],
          });
        })
        dispatch(
          playListActions.setItemList(playList)
        );
      },
      (error)=> {
        console.log('error:', error)
      },
      { onlyOnce: true }
    );
  };
}

export const addPlayList = ({ title, description, successCallback }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const playListRef = ref(database, `/playList`);
    const newListRef = push(playListRef);
    const data = {
      ownerUid: auth.currentUser.uid,
      title,
      description,
      showIdList: '',
    };

    set(newListRef, data)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
      .then(() => {
        dispatch(
          playListActions.addPlayList({ ...data, id: newListRef.key })
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已新增',
          })
        );
        if (successCallback) {
          successCallback();
        }
      }).catch((error) => {
        console.error(error);
      });
  };
}

export const updatePlayList = ({ playListId, title, description }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const data = { title, description };
    update(ref(database, `/playList/${playListId}`), data)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
      .then(() => {
        dispatch(
          playListActions.updatePlayList({ 
            id: playListId,
            title,
            description,
          })
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

export const getPlayListById = (playListId) => {
  console.log('playListId:', playListId)
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    onValue(ref(database, `/playList/${playListId}`),
      (snapshot) => {
        dispatch(
          uiActions.setLoading(false)
        );
        console.log('getPlayListById snapshot.val():', snapshot.val())
      },
      (error)=> {
        dispatch(
          uiActions.setLoading(false)
        );
        console.log('error:', error)
      },
      { onlyOnce: true }
    );
  };
}