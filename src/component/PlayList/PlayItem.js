import { Fragment, useState } from 'react';
import classes from './PlayItem.module.scss';
import Button from 'component/UI/Button';
import PlayModal from 'component/PlayList/PlayModal';
import AddShowModal from 'component/PlayList/AddShowModal';
import { playListActions } from 'store/playList-slice';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

const PlayList = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [actionMenuActive, setActionMenuActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [addShowModalActive, setAddShowModalActive] = useState(false);
  const { item } = props;

  const deletePlayList = () => {
    // fix me show warning
    dispatch(
      playListActions.deletePlayList({
        playListId: item.id,
      })
    );
  }

  const editHandler = () => {
    setModalActive(true);
    setActionMenuActive(false)
  }
  
  const addShowHandler = () => {
    setAddShowModalActive(true);
    setActionMenuActive(false)
  }

  const clickItemHandler = (e) => {
    navigate(`/playListDetail/${item.id}`)
  }

  return (
    <Fragment>
      <li className={classes.item}>
        <div className={classes.cover}>
          {/* {
            // fix me 再想想要顯示什麼圖片或效果
            item.showIdList[0] && <img src={item.showIdList[0].imgUrl} alt="show img" />
          } */}
          {/* <div className={classes.mask} /> */}
          <i className="fa-solid fa-film" />
        </div>
        {/* fix me 處理過長字 */}
        <h3 onClick={clickItemHandler}>{item.title}</h3>
        <div className={classes.actionMenu}>
          {
            actionMenuActive && <span className={classes.menu}>
              <Button
                icon="fa-solid fa-arrow-up-from-bracket"
                className={classes.button}
                // fix me 分享片單功能
                onClick={() => setActionMenuActive(true)}
              />
              <Button
                icon="fa-solid fa-trash-can"
                className={classes.button}
                onClick={deletePlayList}
              />
              <Button
                icon="fa-solid fa-pen"
                className={classes.button}
                onClick={editHandler}
              />
              <Button
                icon="fa-solid fa-plus"
                className={classes.button}
                onClick={addShowHandler}
              />
            </span>
          }
          <Button
            icon="fa-solid fa-ellipsis"
            className={classes.button}
            onClick={() => setActionMenuActive(active => !active)}
          />
        </div>
      </li>
      {
        addShowModalActive &&
          <AddShowModal
            playList={item}
            onClose={() => setAddShowModalActive(false)}
          />
      }
      {
        modalActive &&
          <PlayModal
            type='edit'
            item={item}
            onClose={() => setModalActive(false)}
          />
      }
    </Fragment>
  );
};

export default PlayList;