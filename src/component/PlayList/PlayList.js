import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'store/auth-slice';
import Button from 'component/UI/Button';
import PlayItem from 'component/PlayList/PlayItem';
import PlayModal from 'component/PlayList/PlayModal';
import classes from './PlayList.module.scss';

const PlayList = (props) => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const playList = useSelector((state) => state.playList.itemList);
  const [modalActive, setModalActive] = useState(false);

  const addPlayList = () => {
    if (user.isAnonymous) {
      dispatch(
        authActions.setModalActive(true)
      );
    } else {
      setModalActive(true);
    }
  };

  return (
    <Fragment>
      <section className={classes.playList}>
        <h2>自選片單</h2>
        <ul>
          {
            playList.length < 10 &&
              <li
                className={classes.item}
                style={{ cursor: 'pointer' }}
                onClick={addPlayList}
              >
                <Button
                  icon="fa-solid fa-plus"
                  text="新增"
                  className="primary"
                />
              </li>
          }
          {
            playList.map((item) => (
              <PlayItem
                key={item.id}
                item={item}
              />
            ))
          }
        </ul>
      </section>
      {
        modalActive &&
          <PlayModal
            type='add'
            onClose={() => setModalActive(false)}
          />
      }
    </Fragment>
  );
};

export default PlayList;
