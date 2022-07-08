import ShowItem from 'component/Show/ShowItem';
import Filter from 'component/UI/Filter';
import Pagination from 'component/UI/Pagination';
import classes from './ShowList.module.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ShowList = (props) => {

  const showList = useSelector((state) => state.show.itemList);
  const [filteredList, setfilteredList] = useState([]);
  const [displayList, setDisplayList] = useState([]);

  return (
    <section className={classes.showList}>
      <Filter data={showList} onFilter={setfilteredList}/>
      <section className={classes.showSection}>
        <ul>
          {displayList.map((show) => (
            <ShowItem
              key={show.id}
              show={show}
            />
          ))}
        </ul>
      </section>
      {/* fix me pageSize根據畫面寬度做決定 */}
      <Pagination data={filteredList} pageSize="6" onPageChange={setDisplayList} />
      {
        filteredList.length === 0 && <div className="noData">
          <p>無符合影片</p>
        </div>
      }
    </section>
  );
};

export default ShowList;
