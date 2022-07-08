import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from 'store/auth-slice';
import { map } from 'lodash';
import Modal from 'component/UI/Modal';
import Button from 'component/UI/Button';
import classes from './EditModal.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EditModal = (props) => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [photoURL, setPhotoURL] = useState(user.photoURL || 1);
  const [error, setError] = useState(null);
  const nameRef = useRef();

  const saveHandler = () => {
    if (!nameRef.current.value) {
      setError('名稱為必填喔！');
      return;
    }
    dispatch(
      updateUser(nameRef.current.value, photoURL, props.onClose)
    );
  }

  return (
    <Modal onClose={props.onClose} className={classes.editModal}>
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
                active: photoURL === num,
              })}
              onClick={() => setPhotoURL(num)}
            />
          )
        }
      </div>
      <div>
        <label htmlFor="displayName">名稱</label>
        <input
          ref={nameRef}
          defaultValue={user.displayName}
          id="displayName"
          type="text"
          maxLength="10"
        />
        {
          error && <p className={classes.error}>{error}</p>
        }
      </div>
      <div className={classes.action}>
        <Button
          text="取消"
          className="cancel"
          onClick={props.onClose}
        />
        <Button
          text="儲存"
          className="primary"
          onClick={saveHandler}
        />
      </div>
    </Modal>
  )
};

export default EditModal;