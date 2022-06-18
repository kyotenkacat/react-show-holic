import { useDispatch } from 'react-redux';
import { favoriteActions } from 'store/favorite-slice';
import { uiActions } from 'store/ui-slice';
import classes from './Favorite.module.scss';
import Button from "components/UI/Button";

const Favorite = (props) => {
  const dispatch = useDispatch();

  const toggleFavorite = () => {
    dispatch(
      favoriteActions.toggleFav({
        show: props.show,
        type: props.isFav ? 'remove' : 'add'
      })
    );
    dispatch(
      uiActions.addNotification({
        type: 'success',
        message: props.isFav ? '已取消收藏！' : '已加入收藏！'
      })
    );
    // props.onToggleFav(props.isFav ? 'remove' : 'add');
  };

  return (
    <Button 
      icon={`${props.isFav ? 'fa-solid' : 'fa-regular'} fa-heart`}
      className={classes.favorite + ' ' + props.className}
      onClick={toggleFavorite}
    />
  );

};

export default Favorite;