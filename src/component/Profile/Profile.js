import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { filter } from 'lodash';
import { authActions, signOutUser, deleteGuest } from 'store/auth-slice';
import { getPlayList } from 'store/playList-slice';
import ShowList from 'component/Show/ShowList';
import Button from 'component/UI/Button';
import PlayList from 'component/PlayList/PlayList';
import EditModal from 'component/Profile/EditModal';
import Modal from 'component/UI/Modal';
import classes from './Profile.module.scss';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userInfoList = useSelector((state) => state.auth.userInfoList);
  const authLoading = useSelector((state) => state.auth.authLoading);
  const favList = useSelector((state) => state.favorite.itemList);
  const showList = useSelector((state) => state.show.itemList);
  const favShowList = filter(showList, item => favList.includes(item.id));
  const playList = useSelector((state) => state.playList.itemList);
  const [userInfo, setUserInfo] = useState({ name: ' ', avatar: 0 });
  const [editModalActive, setEditModalActive] = useState(false);
  const [warningModalActive, setWarningModalActive] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      dispatch(getPlayList());
      if (userInfoList[user.uid]) {
        setUserInfo(userInfoList[user.uid]);
      }
    }
  }, [authLoading, user, dispatch, userInfoList]);

  if (authLoading) {
    return <div />;
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
  };
  
  const signOut = () => {
    if (user.isAnonymous) {
      setWarningModalActive(true);
    } else {
      dispatch(
        signOutUser(() => navigate('/'))
      );
    }
  };

  const deleteUser = () => {
    dispatch(
      deleteGuest(() => navigate('/'))
    );
    setWarningModalActive(false);
  };

  return (
    <Fragment>
      <section className={classes.profile}>
        <section className={classes.userSection}>
          <img
            src={require(`asset/img/avatar${userInfo.avatar}.png`)}
            alt="user avatar"
            className={`avatar ${classes.avatar}`}
          />
          <h4>{ user.isAnonymous ? '訪客' : userInfo.name }</h4>
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
              <span className={classes.number}>{playList.length}</span>
              個片單
            </span>
            <span className={classes.data}>
              <span className={classes.number}>{favList.length}</span>
              部收藏
            </span>
          </div>
        </section>
        <PlayList />
        
        <section className={classes.favSection}>
          <h2>收藏清單</h2>
          <ShowList list={favShowList} />
          {
            favList.length === 0 &&
              <div className="noData">
                <p>目前無收藏</p>
                <Link to="/">
                  <Button
                    icon="fa-solid fa-arrow-left"
                    text="瀏覽片單"
                    className="primary"
                  />
                </Link>
              </div>
          }
        </section>
      </section>
      {
        editModalActive &&
          <EditModal
            userInfo={userInfo}
            onClose={() => setEditModalActive(false)}
          />
      }
      {
        warningModalActive &&
          <Modal
            hasAction={true}
            onClose={() => setWarningModalActive(false)}
            onConfirm={deleteUser}
          >
            <p>在訪客模式下登出將會失去所有資料，確定要登出嗎？</p>
          </Modal>
      }
    </Fragment>
  );
};

export default Profile;
