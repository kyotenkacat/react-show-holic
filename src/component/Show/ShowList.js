import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ShowItem from 'component/Show/ShowItem';
import Filter from 'component/UI/Filter';
import Pagination from 'component/UI/Pagination';
import classes from './ShowList.module.scss';

const ShowList = (props) => {

  const showList = useSelector((state) => state.show.itemList);
  const [filteredList, setfilteredList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const resizeHandler = () => {
      let size = 8; // 2 * 4
      if (window.innerWidth >= 1280) {
        size = 16; // 4 * 4
      } else if (window.innerWidth >= 768) {
        size = 12; // 3 * 4
      }
      setPageSize(size);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [pageSize]);

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
      <Pagination data={filteredList} pageSize={pageSize} onPageChange={setDisplayList} />
      {
        filteredList.length === 0 && <div className="noData">
          <p>無符合影片</p>
        </div>
      }
    </section>
  );
};

export default ShowList;
