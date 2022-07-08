import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { map, filter } from 'lodash';
import Modal from 'component/UI/Modal';
import Button from 'component/UI/Button';
import Filter from 'component/UI/Filter';
import Pagination from 'component/UI/Pagination';
import classes from './AddShowModal.module.scss';
import { constant } from 'asset/constant';
import { playListActions } from 'store/playList-slice';
import { uiActions } from 'store/ui-slice';
import classNames from 'classnames';

const AddShowModal = (props) => {

  const dispatch = useDispatch();
  const { playList, onClose } = props;
  const favItems = useSelector((state) => state.favorite.itemList);
  const showItems = useSelector((state) => state.show.itemList);
  const favShowIdList = map(favItems, 'showId');
  const favShowList = filter(showItems, item => favShowIdList.includes(item.id));
  const [filteredList, setfilteredList] = useState([]);
  const [displayList, setDisplayList] = useState([]);


  const isShowInPlayList = (showId) => {
    return playList.showIdList.includes(showId);
  }

  // fix me 上限是10個show
  const toggleShow = (showId) => {
    const isShowInList = isShowInPlayList(showId);
    dispatch(
      playListActions.toggleShow({
        playListId: playList.id,
        showId,
        type: isShowInList ? 'remove' : 'add'
      })
    );
    dispatch(
      uiActions.addNotification({
        type: 'success',
        message: isShowInList ? '已從片單移除！' : '已加入片單！'
      })
    );
  }

  return (
    <Modal onClose={onClose} className={classes.AddShowModal}>
      <Filter data={favShowList} onFilter={setfilteredList}/>
      {/* fix me 處理沒有資料的時候 */}
      <ul className={classes.showList}>
        {
          displayList.map(show => <li key={show.id}>
            <img src={show.imgUrl} className={classes.img} alt="show img" />
            <div className={classes.info}>
              <p>{show.title}</p>
              <span>{show.originalTitle}</span>
            </div>
            <p className={classes.type}>
              {constant.type[show.type]}
            </p>
            <div className={classes.actions}>
              <Button
                icon={classNames('fa-solid', isShowInPlayList(show.id) ? 'fa-minus' : 'fa-plus')}
                className={classes.button}
                onClick={() => toggleShow(show.id)}
              />
            </div>
          </li>)
        }
      </ul>
      <Pagination data={filteredList} pageSize="4" onPageChange={setDisplayList} />
    </Modal>
  )
};

export default AddShowModal;