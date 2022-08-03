import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { indexOf } from 'lodash';
import ShowModal from 'component/Show/ShowModal';
import Favorite from 'component/Show/Favorite';
import classes from './ShowItem.module.scss';

const ShowItem = (props) => {
  const [modalActive, setModalActive] = useState(null);
  const { show, type } = props;

  const favList = useSelector((state) => state.favorite.itemList);
  const isFav = indexOf(favList, show.id) !== -1;

  const openModal = (e) => {
    const className = e.target.className;
    if (!className.includes('heart') && !className.includes('favoriteIcon')) {
      setModalActive(true);
    }
  };

  return (
    <Fragment>
      <li onClick={openModal} className={classes.item}>
        <div className={classes.cover}>
          <img src={show.imgUrl} className={classes.img} alt="show poster" />
          <div className={classes.mask}></div>
        </div>
        <div className={classes.info}>
          <h3>{show.title}</h3>
          <p className={classes.originalTitle}>{show.originalTitle}</p>
          <p className={classes.rating}>
            { show.rating ? show.rating.toFixed(1) : '-' }
          </p>
        </div>
        <Favorite showId={show.id} isFav={isFav} className={classes.favoriteIcon} />
      </li>
      {
        modalActive &&
          <ShowModal
            show={show}
            isFav={isFav}
            type={type}
            onClose={() => setModalActive(false)}
          />
      }
    </Fragment>
  );
};

export default ShowItem;
