import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ShowItem from 'component/Show/ShowItem';
import Filter from 'component/UI/Filter';
import Pagination from 'component/UI/Pagination';
import ShowModal from 'component/Show/ShowModal';
import classes from './ShowList.module.scss';

const ShowList = (props) => {

  const showList = useSelector((state) => state.show.itemList);
  const [show, setShow] = useState(null);
  const [filteredList, setfilteredList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [modalActive, setModalActive] = useState(null);

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

  const openModal = (e, show) => {
    const className = e.target.className;
    if (!className.includes('heart') && !className.includes('favoriteIcon')) {
      setShow(show);
      setModalActive(true);
    }
  };

  return (
    <section className={classes.showList}>
      <Filter data={showList} onFilter={setfilteredList}/>
      <section className={classes.showSection}>
        <ul>
          {
            displayList.map((show) => (
              <ShowItem
                key={show.id}
                show={show}
                onOpenModal={openModal}
              />
            ))
          }
        </ul>
      </section>
      {
        filteredList.length === 0 && <div className="noData">
          <p>無符合影片</p>
        </div>
      }
      <Pagination data={filteredList} pageSize={pageSize} onPageChange={setDisplayList} />
      {
        modalActive &&
          <ShowModal
            show={show}
            onClose={() => setModalActive(false)}
          />
      }
    </section>
  );
};

export default ShowList;
