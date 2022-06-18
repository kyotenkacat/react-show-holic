import Modal from 'components/UI/Modal';
import Favorite from 'components/Favorite/Favorite';
import Review from 'components/Favorite/Review';
import classes from './ShowModal.module.scss';

const platformMapping = {
  1: '電影院',
  2: 'Netflix',
  3: 'Disney+',
  4: 'Amazon Prime Video',
  5: 'HBO'
}

const typeMapping = {
  1: '電影',
  2: '影集',
}

const ShowModal = (props) => {
  const { show, isFav } = props;

  return (
    <Modal onClose={props.onClose} className={classes.showModal}>
      <button onClick={props.onClose} className={classes.closeButton}><i className="fa-solid fa-circle-xmark" /></button>
      <div className={classes.info}>
        <h3>{show.title}</h3>
        <p className={classes.originalTitle}>{show.originalTitle}</p>
        <span>{platformMapping[show.platform]} | </span>
        <span>{typeMapping[show.type]} | </span>
        <span>{show.publishedDate}</span>
        <p className={classes.rating}>{show.rating || '-'}
          <span> / 5</span>
        </p>
        <p className={classes.description}>{show.description}</p>
      </div>
      <div className={classes.imgContainer}>
        <img src={show.imgUrl} alt="show img" className={classes.img} />
        <Favorite show={show} isFav={isFav} />
      </div>
      {
        isFav && <Review show={show} />
      }
    </Modal>
  )
};

export default ShowModal;