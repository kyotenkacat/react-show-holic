import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ShowList from 'component/Show/ShowList';
import Filter from 'component/UI/Filter';
import Pagination from 'component/UI/Pagination';
import classes from './Home.module.scss';

const Home = (props) => {

  const showList = useSelector((state) => state.show.itemList);
  const [filteredList, setfilteredList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const resizeHandler = () => {
      let size = 8; // 2 * 4 row
      if (window.innerWidth >= 1280) {
        size = 16; // 4 * 4 row
      } else if (window.innerWidth >= 768) {
        size = 12; // 3 * 4 row
      }
      setPageSize(size);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <section className={classes.showList}>
      <Filter data={showList} onFilter={setfilteredList}/>
      <section className={classes.showSection}>
        <ShowList list={displayList} />
      </section>
      {
        filteredList.length === 0 && <div className="noData">
          <p>無符合影片</p>
        </div>
      }
      <Pagination data={filteredList} pageSize={pageSize} onPageChange={setDisplayList} />
    </section>
  );
};

export default Home;
