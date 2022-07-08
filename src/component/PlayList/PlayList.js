import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './PlayList.module.scss';
import Button from 'component/UI/Button';
import PlayItem from 'component/PlayList/PlayItem';
import PlayModal from 'component/PlayList/PlayModal';

const PlayList = (props) => {

  const allPlayList = useSelector((state) => state.playList.itemList);
  const [modalActive, setModalActive] = useState(false);

  return (
    <Fragment>
      <section className={classes.playList}>
        <h2>自選片單</h2>
        <ul>
          {
            props.favLength === 0 &&
              <li className={classes.item}>
                <Button
                  text="無收藏影片可新增"
                  className={classes.button}
                  disabled={true}
                />
              </li>
          }
          {
            props.favLength > 0 && allPlayList.length < 5 &&
              <li
                className={classes.item}
                style={{ cursor: 'pointer' }}
                onClick={() => setModalActive(true)}
              >
                <Button
                  icon="fa-solid fa-plus"
                  text="新增"
                  className={classes.button}
                />
              </li>
          }
          {
            allPlayList.map((item) => (
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