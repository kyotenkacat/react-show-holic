import { useRef, useState } from 'react';
import { trim } from 'lodash';
import Modal from 'component/UI/Modal';
import Button from 'component/UI/Button';
import TextareaAutoSize from 'component/UI/TextareaAutoSize';
import classes from './PlayModal.module.scss';
import { useDispatch } from 'react-redux';
import { addPlayList, updatePlayList } from 'store/playList-slice';

const PlayModal = (props) => {

  const dispatch = useDispatch();
  const {
    type,
    item = { title: null, description: null },
    onClose
  } = props;
  const titleRef = useRef();
  const descriptionRef = useRef();
  const [titleError, setTitleError] = useState(false);

  const titleHandler = () => {
    if (titleError && trim(titleRef.current.value)) {
      setTitleError(false);
    }
  }

  const addHandler = () => {
    if (!trim(titleRef.current.value)) {
      setTitleError(true);
      return;
    }
    dispatch(
      addPlayList({
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        successCallback: onClose,
      })
    );
  }
  
  const editHandler = () => {
    if (!trim(titleRef.current.value)) {
      setTitleError(true);
      return;
    }
    dispatch(
      updatePlayList({
        playListId: item.id,
        title: titleRef.current.value,
        description: descriptionRef.current.value,
      })
    );
    onClose();
  }

  return (
    <Modal onClose={onClose} className={classes.playModal}>
      <div className={classes.form}>
        <p className={classes.title}>片單名稱</p>
        <TextareaAutoSize
          name="title"
          minRows="1"
          maxRows="2"
          // fix me 中文跟英文一個字都是一個字...
          // fix me 超過字數後如果還繼續打字的提醒
          // (最多字數 8/20)
          maxLength="20"
          defaultValue={item.title}
          onChange={titleHandler}
          ref={titleRef}
        />
        {
          titleError && <p className="errorMsg">片單名稱為必填喔！</p>
        }
        <p className={classes.title}>描述</p>
        <TextareaAutoSize
          name="description"
          minRows="3"
          maxRows="5"
          maxLength="200"
          defaultValue={item.description}
          ref={descriptionRef}
        />
      </div>
      <div className={classes.action}>
        <Button
          text="取消"
          className="cancel"
          onClick={onClose}
        />
        <Button
          text="儲存"
          className="primary"
          onClick={type === 'add' ? addHandler : editHandler}
        />
      </div>
    </Modal>
  )
};

export default PlayModal;