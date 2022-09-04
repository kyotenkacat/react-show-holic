import { useState, Fragment } from 'react';
import ShowItem from 'component/Show/ShowItem';
import ShowModal from 'component/Show/ShowModal';

const ShowList = (props) => {

  const [show, setShow] = useState(null);
  const [modalActive, setModalActive] = useState(null);

  const openModal = (e, show) => {
    const className = e.target.className;
    if (!className.includes('heart') && !className.includes('favoriteIcon')) {
      setShow(show);
      setModalActive(true);
    }
  };

  return (
    <Fragment>
      <ul>
        {
          props.list.map((show) => (
            <ShowItem
              key={show.id}
              show={show}
              onOpenModal={openModal}
            />
          ))
        }
      </ul>
      {
        modalActive &&
          <ShowModal
            show={show}
            onClose={() => setModalActive(false)}
          />
      }
    </Fragment>
  );
};

export default ShowList;
