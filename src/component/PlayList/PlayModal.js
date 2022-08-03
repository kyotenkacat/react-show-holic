import { useRef, useState } from 'react';
import { trim } from 'lodash';
import { useDispatch } from 'react-redux';
import { addPlayList, updatePlayList } from 'store/playList-slice';
import Modal from 'component/UI/Modal';
import TextareaAutoSize from 'component/UI/TextareaAutoSize';
import classes from './PlayModal.module.scss';

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
  };

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
  };
  
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
  };

  return (
    <Modal
      className={classes.playModal}
      hasAction={true}
      onClose={onClose}
      onConfirm={type === 'add' ? addHandler : editHandler}
      confirmText="儲存"
    >
      <div className={classes.form}>
        <TextareaAutoSize
          ref={titleRef}
          title="片單名稱"
          name="title"
          minRows={1}
          maxRows={2}
          maxLength={20}
          defaultValue={item.title}
          onChange={titleHandler}
        />
        {
          titleError && <p className="errorMsg">片單名稱為必填喔！</p>
        }
        <TextareaAutoSize
          ref={descriptionRef}
          title="描述"
          name="description"
          minRows={6}
          maxRows={12}
          maxLength={200}
          defaultValue={item.description}
        />
      </div>
    </Modal>
  );
};

export default PlayModal;
