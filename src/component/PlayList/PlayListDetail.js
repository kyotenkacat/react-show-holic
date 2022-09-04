import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getPlayListById } from 'store/playList-slice';
import { filter } from 'lodash';
import ShowList from 'component/Show/ShowList';
import classes from './PlayListDetail.module.scss';

const PlayListDetail = (props) => {

  const dispatch = useDispatch();
  const params = useParams();
  const showList = useSelector((state) => state.show.itemList);
  const userInfoList = useSelector((state) => state.auth.userInfoList);
  const [playListId, setPlayListId] = useState(null);
  const [playList, setPlayList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: '匿名', avatar: 0 });

  useEffect(() => {
    setPlayListId(params.playListId);
  }, [params]);

  useEffect(() => {
    if (playListId) {
      dispatch(getPlayListById(playListId, setPlayList));
    }
  }, [dispatch, playListId]);
  
  useEffect(() => {
    if (playList.showIdList && playList.showIdList.length > 0) {
      const list = filter(showList, show => playList.showIdList.includes(show.id));
      setDisplayList(list);
    }
  }, [playList.showIdList, showList]);
  
  useEffect(() => {
    if (playList.uid && userInfoList[playList.uid]) {
      setUserInfo(userInfoList[playList.uid]);
    }
  }, [playList.uid, userInfoList]);
  
  return (
    <section className={classes.playListDetail}>
      <div className={classes.info}>
        <h2>{playList.title}</h2>
        <p>{playList.description}</p>
        {
          playList.uid && <p>
            <img
              src={require(`asset/img/avatar${userInfo.avatar}.png`)}
              alt="user avatar"
              className={`avatar ${classes.avatar}`}
            />
            <span>{ userInfo.name }</span>
          </p>
        }
      </div>
      <section className={classes.showSection}>
        <ShowList list={displayList} />
        {
          displayList.length === 0 && <div className="noData">
            <p>無影片</p>
          </div>
        }
      </section>
    </section>
  );
};

export default PlayListDetail;
