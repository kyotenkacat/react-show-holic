import { createSlice } from '@reduxjs/toolkit';
import {
  signOut, signInAnonymously, signInWithPopup,
  GoogleAuthProvider, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, deleteUser, EmailAuthProvider,
  linkWithCredential, linkWithPopup, browserPopupRedirectResolver
} from 'firebase/auth';
import { auth, database } from 'util/firebase';
import { ref, onValue, remove, set } from 'firebase/database';
import { uiActions } from 'store/ui-slice';
import { favoriteActions } from 'store/favorite-slice';
import { playListActions } from 'store/playList-slice';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authLoading: true,
    user: null,
    modalActive: false,
    userInfoList: {},
  },
  reducers: {
    setAuthLoading(state, action) {
      state.authLoading = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload.user;
    },
    setModalActive(state, action) {
      state.modalActive = action.payload;
    },
    setUserInfoList(state, action) {
      state.userInfoList = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice;

export const signOutUser = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    signOut(auth)
      .then(() => {
        dispatch(
          favoriteActions.setItemList([])
        );
        dispatch(
          playListActions.setItemList([])
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已登出',
          })
        );
        if(successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            errorCode: error.code,
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

export const signInAsGuest = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    signInAnonymously(auth)
      .then(() => {
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已啟用訪客模式',
          })
        );
        if(successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            errorCode: error.code,
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

export const signInByGoogle = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider, browserPopupRedirectResolver)
      .then(() => {
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已登入',
          })
        );
        if(successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            errorCode: error.code,
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

export const signUpByEmail = (email, password, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已註冊並登入',
          })
        );
        if (successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            errorCode: error.code,
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

export const signInByEmail = (email, password, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已登入',
          })
        );
        if (successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            errorCode: error.code,
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

export const deleteGuest = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    deleteUser(auth.currentUser)
      .then(() => {
        dispatch(
          favoriteActions.setItemList([])
        );
        dispatch(
          playListActions.setItemList([])
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已登出',
          })
        );
        if (successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: error.code,
          })
        );
      })
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      });
    remove(ref(database, `/userList/${auth.currentUser.uid}`));
    remove(ref(database, `/favoriteList/${auth.currentUser.uid}`));
  };
};

export const linkGuestToGoogle = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const provider = new GoogleAuthProvider();
    linkWithPopup(auth.currentUser, provider)
      .then((result) => {
        const user = result.user;
        dispatch(
          authActions.setUser({
            user: {
              isAnonymous: user.isAnonymous,
              displayName: user.displayName,
              photoURL: user.photoURL,
              uid: user.uid,
            }
          })
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已註冊正式帳號',
          })
        );
        if(successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: error.code,
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

export const linkGuestToEmail = (email, password, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const credential = EmailAuthProvider.credential(email, password);
    linkWithCredential(auth.currentUser, credential)
      .then((result) => {
        const user = result.user;
        dispatch(
          authActions.setUser({
            user: {
              isAnonymous: user.isAnonymous,
              displayName: user.displayName,
              photoURL: user.photoURL,
              uid: user.uid,
            }
          })
        );
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已註冊正式帳號',
          })
        );
        if (successCallback) {
          successCallback();
        }
      }).catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: error.code,
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

export const updateUser = (name, avatar, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const data = { name, avatar };
    set(ref(database, `/userList/${auth.currentUser.uid}`), data)
      .then(() => {
        dispatch(getUserInfoList());
        dispatch(
          uiActions.addNotification({
            type: 'success',
            message: '已儲存',
          })
        );
        if (successCallback) {
          successCallback();
        }
      })
      .catch((error) => {
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: error.code,
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

export const getUserInfoList = () => {
  return async (dispatch) => {
    onValue(ref(database, '/userList'),
      (snapshot) => {
        dispatch(
          authActions.setUserInfoList(snapshot.val())
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