import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import ShowList from './components/Show/ShowList';
import FavoriteList from './components/Favorite/FavoriteList';
import NotificationList from './components/UI/Notification/NotificationList';
// import { fetchCartData } from './store/cart-actions';

function App() {
  const dispatch = useDispatch();
  // const showCart = useSelector((state) => state.ui.cartIsVisible);
  // const cart = useSelector((state) => state.cart);

  // useEffect(() => {
  //   dispatch(fetchCartData());
  // }, [dispatch]);

  return (
    <BrowserRouter>
      <Layout>
        <NotificationList />
        {/* {showCart && <Cart />} */}
        <Routes>
          <Route path="favorite" element={<FavoriteList />} />
          <Route path="/" element={<ShowList />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
