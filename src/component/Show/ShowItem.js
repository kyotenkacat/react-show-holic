import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import ShowModal from 'component/Show/ShowModal';
import Favorite from 'component/Favorite/Favorite';
import classes from './ShowItem.module.scss';

const ShowItem = (props) => {
  const [modalActive, setModalActive] = useState(null);
  const { show } = props;

  const favItems = useSelector((state) => state.favorite.itemList);
  const match = favItems.find((item) => item.showId === show.id);
  const isFav = !!match;

  const openModal = (e) => {
    const className = e.target.className;
    if (!className.includes('heart') && !className.includes('favoriteIcon')) {
      setModalActive(true)
    }
  }

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
            {/* fix me 處理rating 是整數的情況 */}
            {show.rating || '-'}
          </p>
        </div>
        <Favorite showId={show.id} isFav={isFav} className={classes.favoriteIcon} />
      </li>
      {
        modalActive &&
          <ShowModal
            show={show}
            isFav={isFav}
            onClose={() => setModalActive(false)}
          />
      }
    </Fragment>
  );
};

export default ShowItem;