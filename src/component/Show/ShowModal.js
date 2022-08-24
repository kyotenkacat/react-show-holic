import { find } from 'lodash';
import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getShowReviewList } from 'store/show-slice';
import { constant } from 'asset/constant';
import Modal from 'component/UI/Modal';
import Favorite from 'component/Show/Favorite';
import Review from 'component/Show/Review';
import classes from './ShowModal.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const ShowModal = (props) => {

  const dispatch = useDispatch();
  const { show, onClose } = props;
  const user = useSelector((state) => state.auth.user);
  const userInfoList = useSelector((state) => state.auth.userInfoList);
  const [reviewList, setReviewList] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: null });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const resizeHandler = () => {
      setIsMobile(window.innerWidth <= 576 );
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  useEffect(() => {
    dispatch(getShowReviewList(show.id, setReviewList));
  }, [dispatch, show.id]);

  useEffect(() => {
    if (!user) return; 
    const currentUserReview = find(reviewList, ['uid', user.uid]);
    if (currentUserReview) {
      setUserReview(currentUserReview);
    }
  }, [reviewList, user]);

  return (
    <Modal onClose={onClose} className={classes.showModal}>
      <div className={classes.show}>
        <div className={classes.info}>
          <h3>{show.title}</h3>
          <p className={classes.originalTitle}>{show.originalTitle}</p>
          <span>{constant.platform[show.platform]} | </span>
          <span>{constant.type[show.type]} | </span>
          <span>{show.publishedDate}</span>
          <p className={classes.rating}>{show.rating ? show.rating.toFixed(1) : '-'}
            <span> / 5</span>
          </p>
          {
            !isMobile && <p className={classes.description}>{show.description}</p>
          }
        </div>
        <div className={classes.imgContainer}>
          <img src={show.imgUrl} alt="show img" className={classes.img} />
          <Favorite showId={show.id} onClose={onClose} />
        </div>
        {
          isMobile && <p className={classes.description}>{show.description}</p>
        }
        <Review
          showId={show.id}
          userReview={userReview}
          onClose={onClose}
          onUpdate={() => dispatch(getShowReviewList(show.id, setReviewList))}
        />
      </div>
      <section className={classes.reviewList}>
        <p><span>{reviewList.length}</span> 則評價</p>
        {
          reviewList.length === 0 && <div className={classes.empty}>
            <i className="fa-solid fa-comment-dots" />
            <span>成為第一個評價的人吧！</span>
          </div>
        }
        {
          reviewList.map((review) => (
            <div key={review.id} className={classes.review}>
              <p>
                <img
                  src={require(`asset/img/avatar${userInfoList[review.uid]?.avatar || 0}.png`)}
                  alt="user avatar"
                  className={`avatar ${classes.avatar}`}
                />
                <span className={classes.userName}>{ userInfoList[review.uid]?.name || '匿名' }</span>
              </p>
              <div className={classes.rating}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <i
                    key={num}
                    className={cx({
                      'fa-solid fa-star': true,
                      active: num <= review.rating,
                    })}
                  />
                ))}
              </div>
              <p className={classes.comment}>{review.comment}</p>
            </div>
          ))
        }
      </section>
    </Modal>
  );
};

export default ShowModal;
