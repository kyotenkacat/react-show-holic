import { createSlice } from '@reduxjs/toolkit';
import {
  signOut, signInAnonymously, signInWithPopup,
  GoogleAuthProvider, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, deleteUser, EmailAuthProvider,
  linkWithCredential, linkWithPopup, updateProfile,
} from 'firebase/auth'
import { auth, database } from 'util/firebase';
import { ref, onValue, query, orderByChild, equalTo,
  push, set, update, remove } from 'firebase/database';
import { uiActions } from 'store/ui-slice';
import { favoriteActions } from 'store/favorite-slice';
import { playListActions } from 'store/playList-slice';
import { forEach } from 'lodash';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authLoading: true,
    user: null,
    modalActive: false,
  },
  reducers: {
    setAuthLoading(state, action) {
      state.authLoading = action.payload;
    },
    setUser(state, action) {
      console.log('action.payload:', action.payload)
      state.user = action.payload.user;
    },
    setModalActive(state, action) {
      state.modalActive = action.payload;
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
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
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
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}

export const signInAsGuest = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    signInAnonymously(auth)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
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
        // fix me 統一處理errorCode翻譯對應
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}

export const signInByGoogle = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
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
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}

export const signUpByEmail = (email, password, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    createUserWithEmailAndPassword(auth, email, password)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
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
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}

export const signInByEmail = (email, password, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    signInWithEmailAndPassword(auth, email, password)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
      .then((response) => {
        console.log('response:', response)
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
        const errorCode = error.code;
        // errorCode: auth/user-not-found
        const errorMessage = error.message;
        // errorMessage: Firebase: Error (auth/user-not-found).

        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}

export const deleteGuest = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    // // fix me 確認片單資料要怎麼刪
    // const updates = {
    //   [`/favoriteList/${auth.currentUser.uid}`]: null,
    //   // [`/playList/${auth.currentUser.uid}`]: null,
    // };
    // update(ref(database), updates);


    onValue(query(ref(database, `/playList`), orderByChild('ownerUid'), equalTo(auth.currentUser.uid)),
      (snapshot) => {
        snapshot.forEach((deedSnapshot) =>{
          console.log('deedSnapshot:', deedSnapshot)
          remove(deedSnapshot.ref);
        })
      },
      (error)=> {
        console.log('error:', error)
      }
    );

    // deleteUser(auth.currentUser)
    //   .finally(() => {
    //     dispatch(
    //       uiActions.setLoading(false)
    //     );
    //   })
    //   .then(() => {
    //     dispatch(
    //       uiActions.addNotification({
    //         type: 'success',
    //         message: '已登出',
    //       })
    //     );
    //     if (successCallback) {
    //       successCallback();
    //     }
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     // errorCode: auth/user-not-found
    //     const errorMessage = error.message;
    //     // errorMessage: Firebase: Error (auth/user-not-found).

    //     dispatch(
    //       uiActions.addNotification({
    //         type: 'error',
    //         message: errorMessage,
    //       })
    //     );
    //   });
  };
}

export const linkGuestToGoogle = (successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const provider = new GoogleAuthProvider();

    linkWithPopup(auth.currentUser, provider)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
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
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}

export const linkGuestToEmail = (email, password, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const credential = EmailAuthProvider.credential(email, password);

    linkWithCredential(auth.currentUser, credential)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
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
        console.log("Account linking error", error);
        const errorCode = error.code;
        // errorCode: auth/user-not-found
        const errorMessage = error.message;
        // errorMessage: Firebase: Error (auth/user-not-found).

        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}

export const updateUser = (displayName, photoURL, successCallback) => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    const data = { displayName, photoURL };
    const user = auth.currentUser;

    updateProfile(user, data)
      .finally(() => {
        dispatch(
          uiActions.setLoading(false)
        );
      })
      .then(() => {
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
            message: '已修改個人資料',
          })
        );
        if (successCallback) {
          successCallback();
        }
      }).catch((error) => {
        console.log("Account linking error", error);
        const errorCode = error.code;
        // errorCode: auth/user-not-found
        const errorMessage = error.message;
        // errorMessage: Firebase: Error (auth/user-not-found).

        dispatch(
          uiActions.addNotification({
            type: 'error',
            message: errorMessage,
          })
        );
      });
  };
}