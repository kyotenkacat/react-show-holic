import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'util/firebase';
import { authActions, getUserInfoList } from 'store/auth-slice';
import { getShowList } from 'store/show-slice';
import { getFavList } from 'store/favorite-slice';
import ShowList from './component/Show/ShowList';
import Profile from './component/Profile/Profile';
import PlayListDetail from './component/PlayList/PlayListDetail';
import NotificationList from './component/UI/Notification/NotificationList';
import AuthModal from './component/Auth/AuthModal';
import Loading from './component/UI/Loading';
import Header from './component/Layout/Header';
import Footer from './component/Layout/Footer';

function App() {

  const dispatch = useDispatch();
  const authModalActive = useSelector((state) => state.auth.modalActive);
  const loading = useSelector((state) => state.ui.loading);
  
  useEffect(() => {
    dispatch(getShowList());
    dispatch(getUserInfoList());
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      dispatch(
        authActions.setUser({
          user: user ? {
            isAnonymous: user.isAnonymous,
            displayName: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
          } : null
        })
      );
      dispatch(
        authActions.setAuthLoading(false)
      );
      if (user) {
        dispatch(getFavList());
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      { loading && <Loading /> }
      { authModalActive && <AuthModal /> }
      <Header />
      <main>
        <NotificationList />
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="playListDetail/:playListId" element={<PlayListDetail />} />
          <Route path="/" element={<ShowList />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
