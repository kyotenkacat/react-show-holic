import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from 'store/auth-slice';
import { map } from 'lodash';
import Modal from 'component/UI/Modal';
import classes from './EditModal.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EditModal = (props) => {
  
  const { userInfo, onClose } = props;
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(userInfo.avatar || 1);
  const [error, setError] = useState(null);
  const nameRef = useRef();

  const saveHandler = () => {
    if (!nameRef.current.value) {
      setError('名稱為必填喔！');
      return;
    }
    dispatch(
      updateUser(nameRef.current.value, avatar, onClose)
    );
  };

  return (
    <Modal
      className={classes.editModal}
      onClose={onClose}
      hasAction={true}
      onConfirm={saveHandler}
      confirmText="儲存"
    >
      <div>
        <label>頭像</label>
        {
          map([1, 2, 3, 4, 5, 6], (num) => 
            <img
              key={num}
              src={require(`asset/img/avatar${num}.png`)}
              alt={`avatar${num}`}
              className={cx({
                avatar: true,
                active: avatar === num,
              })}
              onClick={() => setAvatar(num)}
            />
          )
        }
      </div>
      <div>
        <label htmlFor="displayName">名稱</label>
        <input
          ref={nameRef}
          defaultValue={userInfo.name}
          id="displayName"
          type="text"
          maxLength="10"
        />
        {
          error && <p className={classes.error}>{error}</p>
        }
      </div>
    </Modal>
  );
};

export default EditModal;
