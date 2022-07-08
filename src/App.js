import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from 'util/firebase';
import Layout from './component/Layout/Layout';
import ShowList from './component/Show/ShowList';
import Profile from './component/Profile/Profile';
import PlayListDetail from './component/PlayList/PlayListDetail';
import NotificationList from './component/UI/Notification/NotificationList';
import AuthModal from './component/Auth/AuthModal';
import Loading from './component/UI/Loading';
import { authActions } from 'store/auth-slice';
import { getShowList } from 'store/show-slice';
import { getFavList } from 'store/favorite-slice';

function App() {

  const dispatch = useDispatch();
  const authModalActive = useSelector((state) => state.auth.modalActive);
  const loading = useSelector((state) => state.ui.loading);
  
  useEffect(() => {
    dispatch(getShowList());
    onAuthStateChanged(auth, (user) => {
      console.log('app useEffect user:', user)
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
    })
  }, [dispatch]);

  return (
    <BrowserRouter>
      { loading && <Loading /> }
      { authModalActive && <AuthModal /> }
      <Layout>
        <NotificationList />
        {/* {showCart && <Cart />} */}
        <Routes>
          <Route path="profile" element={<Profile />} />
          <Route path="playListDetail/:playListId" element={<PlayListDetail />} />
          <Route path="/" element={<ShowList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
