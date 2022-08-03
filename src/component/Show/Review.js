import { Fragment, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReview, updateReview } from 'store/show-slice';
import { authActions } from 'store/auth-slice';
import Button from 'component/UI/Button';
import TextareaAutoSize from 'component/UI/TextareaAutoSize';
import classes from './Review.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Review = (props) => {

  const dispatch = useDispatch();
  const { showId, userReview, onUpdate, onClose } = props;
  const user = useSelector((state) => state.auth.user);
  const [isEdit, setIsEdit] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const commentRef = useRef();

  useEffect(() => {
    setRating(userReview.rating);
  }, [userReview]);

  const editHandler = () => {
    if (user) {
      setIsEdit(true);
    } else {
      dispatch(
        authActions.setModalActive(true)
      );
      onClose();
    }
  };

  const ratingHandler = (num) => {
    setRating(num);
    setRatingError(false);
  };

  const cancelHandler = () => {
    setRating(userReview.rating);
    setIsEdit(false);
  };

  const saveHandler = () => {
    if (rating === 0) {
      setRatingError(true);
      return;
    }
    if (userReview.id) {
      dispatch(
        updateReview({
          showId: showId,
          reviewId: userReview.id,
          rating,
          comment: commentRef.current.value,
        })
      );
    } else {
      dispatch(
        addReview({
          showId,
          rating,
          comment: commentRef.current.value,
        })
      );
    }
    onUpdate();
    setIsEdit(false);
  };

  return (
    <Fragment>
      <section className={classes.review}>
        {
          isEdit && <div className={classes.form}>
            <div className={classes.rating} onMouseLeave={() => setRatingHover(0)}>
              {[1, 2, 3, 4, 5].map((num) => (
                <i
                  key={num}
                  className={cx({
                    'fa-solid fa-star': true,
                    active: num <= rating || num <= ratingHover,
                  })}
                  onMouseOver={() => setRatingHover(num)}
                  onClick={() => ratingHandler(num)}
                />
              ))}
              {
                ratingError && <p className="errorMsg">評分為必填喔！</p>
              }
            </div>
            <TextareaAutoSize
              ref={commentRef}
              name="showReview"
              minRows={5}
              maxRows={8}
              maxLength={200}
              defaultValue={userReview.comment}
            />
            <div className={classes.action}>
              <Button
                text="取消"
                className="cancel"
                onClick={cancelHandler}
              />
              <Button
                text="儲存"
                className="primary"
                onClick={saveHandler}
              />
            </div>
          </div>
        }
        {
          !isEdit && <div className={classes.form}>
            <div className={classes.rating}>
              {rating > 0 && [1, 2, 3, 4, 5].map((num) => (
                <i
                  key={num}
                  className={cx({
                    'fa-solid fa-star': true,
                    active: num <= rating,
                  })}
                />
              ))}
            </div>
            {
              userReview.comment && <p>{userReview.comment}</p>
            }
            <div className={classes.action}>
              <Button
                text={rating > 0 ? '編輯評價' : '新增評價'}
                className="primary"
                onClick={editHandler}
              />
            </div>
          </div>
        }
      </section>
    </Fragment>
  );
};

export default Review;
