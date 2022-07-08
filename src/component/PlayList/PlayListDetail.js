import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { find } from 'lodash'
import classes from './PlayListDetail.module.scss';

const PlayListDetail = (props) => {

  const params = useParams();
  const allPlayList = useSelector((state) => state.playList.itemList);
  const playList = find(allPlayList, ['id', Number(params.playListId)]);

  return (
    <section className={classes.playListDetail}>
      <h2>{playList.title}</h2>
      <p>{playList.description}</p>
    </section>
  )
};

export default PlayListDetail;