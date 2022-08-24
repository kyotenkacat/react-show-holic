import { Fragment } from 'react';
import Favorite from 'component/Show/Favorite';
import classes from './ShowItem.module.scss';

const ShowItem = (props) => {
  
  const { show, onOpenModal } = props;

  return (
    <Fragment>
      <li onClick={(e) => onOpenModal(e, show)} className={classes.item}>
        <div className={classes.cover}>
          <img src={show.imgUrl} className={classes.img} alt={`poster of ${show.title}`} />
          <div className={classes.mask}></div>
        </div>
        <div className={classes.info}>
          <h3>{show.title}</h3>
          <p className={classes.originalTitle}>{show.originalTitle}</p>
          <p className={classes.rating}>
            { show.rating ? show.rating.toFixed(1) : '-' }
          </p>
        </div>
        <Favorite showId={show.id} className={classes.favoriteIcon} />
      </li>
    </Fragment>
  );
};

export default ShowItem;
