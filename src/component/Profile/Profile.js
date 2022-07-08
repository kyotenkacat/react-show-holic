import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { map, filter } from 'lodash';
import { authActions, signOutUser, deleteGuest } from 'store/auth-slice';
import { getPlayList } from 'store/playList-slice';
import ShowItem from 'component/Show/ShowItem';
import Button from 'component/UI/Button';
import PlayList from 'component/PlayList/PlayList';
import EditModal from 'component/Profile/EditModal';
import classes from './Profile.module.scss';

const Profile = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.authLoading);
  const favList = useSelector((state) => state.favorite.itemList);
  const showList = useSelector((state) => state.show.itemList);
  const favShowIdList = map(favList, 'showId');
  const favShowList = filter(showList, item => favShowIdList.includes(item.id));
  const favRateList = filter(favList, item => item.favRating !== 0);
  const playList = useSelector((state) => state.playList.itemList);
  const [editModalActive, setEditModalActive] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      dispatch(getPlayList());
    }
  }, [authLoading, user, dispatch]);

  if (authLoading) {
    return <div />
  }

  if (!authLoading && !user) {
    return <Navigate to="/" replace />;
  }

  const editUser = () => {
    if (user.isAnonymous) {
      dispatch(
        authActions.setModalActive(true)
      );
    } else {
      setEditModalActive(true);
    }
  }
  
  const signOut = () => {
    if (user.isAnonymous) {
      // fix me 跳出warning警告資料會消失
      dispatch(
        deleteGuest(() => navigate('/'))
      );
    } else {
      dispatch(
        signOutUser(() => navigate('/'))
      );
    }
  }

  return (
    <Fragment>
      <section className={classes.profile}>
        <section className={classes.userSection}>
          <img
            src={require(`asset/img/avatar${user.photoURL || 'Ghost'}.png`)}
            alt="user avatar"
          />
          <p>{ user.isAnonymous ? '訪客' : user.displayName || ' ' }</p>
          <Button
            icon="fa-solid fa-pen"
            className={classes.button}
            onClick={editUser}
          />
          <Button
            icon="fa-solid fa-arrow-right-from-bracket"
            className={classes.button}
            onClick={signOut}
          />
          <div>
            <span className={classes.data}>
              <span className={classes.number}>{favList.length}</span>
              部收藏
            </span>
            <span className={classes.data}>
              <span className={classes.number}>{favRateList.length}</span>
              個評價
            </span>
            <span className={classes.data}>
              <span className={classes.number}>{playList.length}</span>
              個片單
            </span>
          </div>
        </section>
        <PlayList favLength={favList.length} />
        
        <section className={classes.favSection}>
          <h2>收藏清單</h2>
          {
            favList.length === 0 &&
              <div className="noData">
                <p>目前無收藏...</p>
                <Link to="/">
                  <Button
                    icon="fa-solid fa-arrow-left"
                    text="瀏覽片單"
                    className={classes.button}
                  />
                </Link>
              </div>
          }
          <ul>
            {/* fix me 分頁？ */}
            {favShowList.map((show) => (
              <ShowItem
                key={show.id}
                show={show}
              />
            ))}
          </ul>
        </section>
      </section>
      {
        editModalActive &&
          <EditModal
            onClose={() => setEditModalActive(false)}
          />
      }
    </Fragment>
  );
};

export default Profile;
