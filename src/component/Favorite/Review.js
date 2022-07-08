import { Fragment, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateReview } from 'store/favorite-slice';
import Button from 'component/UI/Button';
import TextareaAutoSize from 'component/UI/TextareaAutoSize';
import classes from './Review.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Review = (props) => {

  const dispatch = useDispatch();
  const favItems = useSelector((state) => state.favorite.itemList);
  const favShow = favItems.find((item) => item.showId === props.showId);

  const [isEdit, setIsEdit] = useState(false);
  const [rating, setRating] = useState(favShow.favRating);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingError, setRatingError] = useState(false);

  const commentRef = useRef();

  const ratingHandler = (num) => {
    setRating(num)
    setRatingError(false);
  }

  const cancelHandler = () => {
    setRating(favShow.favRating || 0);
    setIsEdit(false)
  }

  const saveHandler = () => {
    if (rating === 0) {
      setRatingError(true);
      return;
    }
    dispatch(
      updateReview({
        showId: props.showId,
        favRating: rating,
        favComment: commentRef.current.value,
      })
    );
    setIsEdit(false);
  }

  return (
    <Fragment>
      <div className={classes.seperate} />
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
              minRows="5"
              maxRows="8"
              maxLength="300"
              defaultValue={favShow.favComment}
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
              favShow.favComment && <p>{favShow.favComment}</p>
            }
            <div className={classes.action}>
              <Button
                text={rating > 0 ? '編輯評價' : '新增評價'}
                className="primary"
                onClick={() => setIsEdit(true)}
              />
            </div>
          </div>
        }
      </section>
    </Fragment>
  );
};

export default Review;