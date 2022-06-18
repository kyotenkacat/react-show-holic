import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import ShowModal from 'components/Show/ShowModal';
import Favorite from 'components/Favorite/Favorite';
import classes from './ShowItem.module.scss';

const ShowItem = (props) => {
  const [modalActive, setModalActive] = useState(null);
  const { show, pageType = 'main' } = props;

  const favItems = useSelector((state) => state.favorite.items);
  const match = favItems.find((item) => item.id === show.id);
  const isFav = !!match;

  const toggleModal = (e, isOpen) => {
    const className = e.target.className;
    if (!className.includes('heart') && !className.includes('favoriteIcon')) {
      setModalActive(isOpen)
    }
  }

  return (
    <Fragment>
      <li onClick={(e) => toggleModal(e, true)} className={classes.item}>
        <div className={classes.cover}>
          <img src={show.imgUrl} className={classes.img} alt="show img" />
          <div className={classes.mask}></div>
        </div>
        <div className={classes.info}>
          <h3>{show.title}</h3>
          <p className={classes.originalTitle}>{show.originalTitle}</p>
          <p className={classes.rating + ' ' + classes[pageType]}>
            {(pageType === 'main' ? show.rating : show.favRating) || '-'}
          </p>
        </div>
        <Favorite show={show} className={classes.favoriteIcon} isFav={isFav} />
        <div className={classes.actions}>
        </div>
      </li>
      {
        modalActive && <ShowModal onClose={(e) => toggleModal(e, false)} show={show} isFav={isFav} />
      }
    </Fragment>
  );
};

export default ShowItem;