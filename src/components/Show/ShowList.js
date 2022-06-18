import ShowItem from 'components/Show/ShowItem';
import classes from './ShowList.module.scss';
import { useEffect, useState } from 'react';

const ShowList = (props) => {
  const [showList, setShowList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    const fetchShowList = async () => {
      const response = await fetch(
        'https://react-screen-holic-default-rtdb.firebaseio.com/showList.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();

      const loadedShow = [];
      for (const key in data) {
        loadedShow.push({
          id: key,
          title: data[key].title,
          originalTitle: data[key].originalTitle,
          description: data[key].description,
          imgUrl: data[key].imgUrl,
          platform: data[key].platform,
          publishedDate: data[key].publishedDate,
          rating: data[key].rating,
          type: data[key].type,
        });
      }

      setShowList(loadedShow);
      setIsLoading(false);
    };

    fetchShowList().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={classes.loading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={classes.error}>
        <p>{httpError}</p>
      </section>
    );
  }

  return (
    <section className={classes.showList}>
      <ul>
        {showList.map((show) => (
          <ShowItem
            key={show.id}
            show={show}
          />
        ))}
      </ul>
    </section>
  );
};

export default ShowList;
