import { useDispatch, useSelector } from 'react-redux';
import { toggleFav } from 'store/favorite-slice';
import { authActions } from 'store/auth-slice';
import Button from 'component/UI/Button';
import classes from './Favorite.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Favorite = (props) => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  const toggleFavorite = () => {
    if (user) {
      dispatch(toggleFav({
        showId: props.showId,
        type: props.isFav ? 'remove' : 'add',
      }));
    } else {
      dispatch(
        authActions.setModalActive(true)
      );
      if (props.onClose) {
        props.onClose();
      }
    }
  };

  return (
    <Button
      icon={`${props.isFav ? 'fa-solid' : 'fa-regular'} fa-heart`}
      className={cx({
        favorite: true,
        [props.className]: true,
      })}
      onClick={toggleFavorite}
    />
  );

};

export default Favorite;