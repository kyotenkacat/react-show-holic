import { createSlice } from '@reduxjs/toolkit';
import { findIndex, find, forEach } from 'lodash';
import { auth, database } from 'util/firebase';
import {
  ref, onValue, query, orderByChild, equalTo,
  push, set, update, remove
} from 'firebase/database';
import { uiActions } from 'store/ui-slice';

const playListSlice = createSlice({
  name: 'playList',
  initialState: {
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
      const matchIndex = findIndex(state.itemList, ['id', action.payload]);
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
    onValue(query(ref(database, `/playList`), orderByChild('uid'), equalTo(auth.currentUser.uid)),
      (snapshot) => {
        const itemList = [];
        forEach(snapshot.val(), (item, id) => {
          const data = {
            id,
            title: item.title,
            description: item.description,
            showIdList: [],
          };
          forEach(item.showIdList, (value, showId) => {
            data.showIdList.push(showId);
          });
          itemList.push(data);
        });
        dispatch(
          playListActions.setItemList(itemList)
        );
      },
      ()=> {
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

export const addPlayList = ({ title, description, successCallback }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const playListRef = ref(database, '/playList');
    const newListRef = push(playListRef);
    const data = {
      uid: auth.currentUser.uid,
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

export const updatePlayList = ({ playListId, title, description }) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    update(ref(database, `/playList/${playListId}`), { title, description })
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

export const deletePlayList = (playListId) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    remove(ref(database, `/playList/${playListId}`))
      .then(() => {
        dispatch(
          playListActions.deletePlayList(playListId)
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已刪除',
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

export const toggleShow = ({ playListId, type, showId }) => {
  return (dispatch) => {
    
    dispatch(
      uiActions.setLoading(true)
    );

    const data = { [showId]: type === 'add' ? true : null };
    update(ref(database, `/playList/${playListId}/showIdList`), data)
      .then(() => {
        dispatch(
          playListActions.toggleShow({ id: playListId, type, showId })
        );
        dispatch(getPlayList());
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: type === 'add' ? '已加入片單！' : '已從片單移除！'
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

export const getPlayListById = (playListId, setPlayList) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    onValue(ref(database, `/playList/${playListId}`),
      (snapshot) => {
        dispatch(
          uiActions.setLoading(false)
        );
        const value = snapshot.val();
        const data = {
          id: playListId,
          title: value.title,
          description: value.description,
          uid: value.uid,
          showIdList: [],
        };
        forEach(value.showIdList, (value, showId) => {
          data.showIdList.push(showId);
        });
        setPlayList(data);
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
