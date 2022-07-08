import Modal from 'component/UI/Modal';
import Favorite from 'component/Favorite/Favorite';
import Review from 'component/Favorite/Review';
import classes from './ShowModal.module.scss';
import { constant } from 'asset/constant';

const ShowModal = (props) => {
  const { show, isFav, onClose } = props;

  return (
    <Modal onClose={onClose} className={classes.showModal}>
      <div className={classes.info}>
        <h3>{show.title}</h3>
        <p className={classes.originalTitle}>{show.originalTitle}</p>
        <span>{constant.platform[show.platform]} | </span>
        <span>{constant.type[show.type]} | </span>
        <span>{show.publishedDate}</span>
        <p className={classes.rating}>{show.rating || '-'}
          <span> / 5</span>
        </p>
        <p className={classes.description}>{show.description}</p>
      </div>
      <div className={classes.imgContainer}>
        <img src={show.imgUrl} alt="show img" className={classes.img} />
        <Favorite showId={show.id} isFav={isFav} onClose={onClose} />
      </div>
      {
        isFav && <Review showId={show.id} />
      }
    </Modal>
  )
};

export default ShowModal;