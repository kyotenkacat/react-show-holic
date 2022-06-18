import ShowItem from 'components/Show/ShowItem';
import classes from './FavoriteList.module.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import Button from "components/UI/Button";

const FavoriteList = (props) => {
  const favItems = useSelector((state) => state.favorite.items);


  return (
    <section className={classes.favoriteList}>
      {favItems.length === 0 &&
        <div className={classes.noData}>
          <p>目前無收藏...</p>
          <Link to="/">
            <Button 
              icon="fa-solid fa-arrow-left"
              text="瀏覽片單"
              className={classes.button}
            />
          </Link>
        </div>
      }
      <ul>
        {favItems.map((show) => (
          <ShowItem
            key={show.id}
            pageType='favorite'
            show={show}
          />
        ))}
      </ul>
    </section>
  );
};

export default FavoriteList;
