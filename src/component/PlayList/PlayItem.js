import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { deletePlayList } from 'store/playList-slice';
import { uiActions } from 'store/ui-slice';
import { find } from 'lodash';
import Button from 'component/UI/Button';
import PlayModal from 'component/PlayList/PlayModal';
import AddShowModal from 'component/PlayList/AddShowModal';
import Modal from 'component/UI/Modal';
import classes from './PlayItem.module.scss';

const PlayList = (props) => {

  const dispatch = useDispatch();
  const { item } = props;
  const showList = useSelector((state) => state.show.itemList);
  const [itemImg, setItemImg] = useState(null);
  const [actionMenuActive, setActionMenuActive] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [addShowModalActive, setAddShowModalActive] = useState(false);
  const [warningModalActive, setWarningModalActive] = useState(false);

  useEffect(() => {
    if (item.showIdList.length !== 0) {
      const show = find(showList, ['id', item.showIdList[0]]);
      setItemImg(show.imgUrl);
    }
  }, [showList, item.showIdList]);


  const shareHandler = () => {
    navigator.clipboard.writeText(`${window.location.origin}/playListDetail/${item.id}`);
    dispatch(
      uiActions.addNotification({
        type: 'success',
        message: '已複製連結',
      })
    );
  };

  const deleteHandler = () => {
    dispatch(
      deletePlayList(item.id)
    );
    setWarningModalActive(false);
  };

  const editHandler = () => {
    setModalActive(true);
    setActionMenuActive(false);
  };
  
  const addShowHandler = () => {
    setAddShowModalActive(true);
    setActionMenuActive(false);
  };

  return (
    <Fragment>
      <li className={classes.item}>
        <div className={classes.cover}>
          { itemImg && <img src={itemImg} alt="show" /> }
          { !itemImg && <i className="fa-solid fa-film" /> }
          <div className={classes.mask} />
        </div>
        <h4>
          <NavLink to={`/playListDetail/${item.id}`}>
            {item.title}
          </NavLink>
        </h4>
        <div className={classes.actionMenu}>
          {
            actionMenuActive && <span className={classes.menu}>
              <Button
                icon="fa-solid fa-arrow-up-from-bracket"
                className={classes.button}
                onClick={shareHandler}
              />
              <Button
                icon="fa-solid fa-trash-can"
                className={classes.button}
                onClick={() => setWarningModalActive(true)}
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
          <div className={classes.action}>
            <Button
              icon="fa-solid fa-ellipsis"
              className={classes.button}
              onClick={() => setActionMenuActive(active => !active)}
            />
          </div>
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
      {
        warningModalActive &&
          <Modal
            hasAction={true}
            onClose={() => setWarningModalActive(false)}
            onConfirm={deleteHandler}
          >
            <p>確定要刪除片單嗎？</p>
          </Modal>
      }
    </Fragment>
  );
};

export default PlayList;
