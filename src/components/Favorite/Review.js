import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { favoriteActions } from 'store/favorite-slice';
import classes from './Review.module.scss';
import Button from "components/UI/Button";

const Review = (props) => {
  const dispatch = useDispatch();

  const favItems = useSelector((state) => state.favorite.items);
  const match = favItems.find((item) => item.id === props.show.id);
  const [isEdit, setIsEdit] = useState(false);
  const [rating, setRating] = useState(match.favRating);
  const [comment, setComment] = useState(match.favComment);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingError, setRatingError] = useState(false);

  

  const ratingHandler = (num) => {
    setRating(num)
    setRatingError(false);
  }

  const saveHandler = () => {
    if (rating === 0) {
      setRatingError(true);
      return;
    }
    dispatch(
      favoriteActions.updateReview({
        showId: props.show.id,
        favRating: rating,
        favComment: comment,
      })
    );
    setIsEdit(false);
  }

  return (
    <Fragment>
      <div className={classes.seperate}></div>
      <section className={classes.review}>
        {
          isEdit && <div className={classes.form}>
            <div className={classes.rating} onMouseLeave={()=>setRatingHover(0)}>
              {[1, 2, 3, 4, 5].map((num) => (
                <i
                  key={num}
                  className={'fa-solid fa-star ' + (num <= rating || num < ratingHover ? classes.active : undefined)}
                  onMouseOver={()=>setRatingHover(num)}
                  onClick={()=>ratingHandler(num)}
                />
              ))}
              {
                ratingError && <p>評分為必填喔！</p>
              }
            </div>
            <textarea
              name='showReview'
              rows="3"
              // value={lastNameValue}
              // onChange={lastNameChangeHandler}
              // onBlur={lastNameBlurHandler}
            />
            <div className={classes.action}>
              <Button 
                text="取消"
                className={classes.cancel}
                onClick={()=>setIsEdit(false)}
              />
              <Button 
                text="儲存"
                className={classes.primary}
                onClick={saveHandler}
              />
            </div>
          </div>
        }
        {
          !isEdit && <div className={classes.form}>
            <div className={classes.rating}>
              {[1, 2, 3, 4, 5].map((num) => (
                <i
                  key={num}
                  className={'fa-solid fa-star ' + (num <= rating ? classes.active : undefined)}
                />
              ))}
            </div>
            {
              comment && <p>{comment}</p>
            }
            <div className={classes.action}>
              <Button 
                text="編輯"
                className={classes.primary}
                onClick={()=>setIsEdit(true)}
              />
            </div>
          </div>
        }
      </section>
    </Fragment>
  );
};

export default Review;