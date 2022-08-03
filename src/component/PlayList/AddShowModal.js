import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { constant } from 'asset/constant';
import { toggleShow } from 'store/playList-slice';
import Modal from 'component/UI/Modal';
import Button from 'component/UI/Button';
import Filter from 'component/UI/Filter';
import Pagination from 'component/UI/Pagination';
import classes from './AddShowModal.module.scss';

const AddShowModal = (props) => {

  const dispatch = useDispatch();
  const { playList, onClose } = props;
  const showList = useSelector((state) => state.show.itemList);
  const [filteredList, setfilteredList] = useState([]);
  const [displayList, setDisplayList] = useState([]);

  const isShowInPlayList = (showId) => {
    return playList.showIdList.includes(showId);
  };

  const toggleShowInPlayList = (showId) => {
    const isShowInList = isShowInPlayList(showId);
    dispatch(
      toggleShow({
        playListId: playList.id,
        type: isShowInList ? 'remove' : 'add',
        showId,
      })
    );
  };

  return (
    <Modal onClose={onClose} className={classes.AddShowModal}>
      <Filter data={showList} onFilter={setfilteredList}/>
      <ul className={classes.showList}>
        {
          displayList.map(show => <li key={show.id}>
            <img src={show.imgUrl} className={classes.img} alt="show img" />
            <div className={classes.info}>
              <p>{show.title} {show.id}</p>
              <span>{show.originalTitle}</span>
            </div>
            <p className={classes.type}>
              {constant.type[show.type]}
            </p>
            <div className={classes.actions}>
              <Button
                icon={`fa-solid ${isShowInPlayList(show.id) ? 'fa-minus' : 'fa-plus'}`}
                className={isShowInPlayList(show.id) ? classes.active : classes.inActive}
                onClick={() => toggleShowInPlayList(show.id)}
              />
            </div>
          </li>)
        }
      </ul>
      <Pagination data={filteredList} pageSize={4} onPageChange={setDisplayList} />
      {
        filteredList.length === 0 && <div className="noData">
          <p>無符合影片</p>
        </div>
      }
    </Modal>
  );
};

export default AddShowModal;
