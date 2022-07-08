import { useState, useEffect } from 'react';
import { range } from 'lodash';
import Button from 'component/UI/Button';
import classes from './Pagination.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Pagination = (props) => {

  const { data, pageSize, onPageChange } = props;

  const totalPageCount = Math.ceil(data.length / pageSize);
  const pageNumbers = range(1, totalPageCount + 1);
  const [currentPage, setCurrentPage] = useState(1);

  const directionHandler = (value) => {
    setCurrentPage(prevState => prevState + value);
  }

  useEffect(() => {
    const currentPageData = data.slice(
      (currentPage - 1) * pageSize,
      (currentPage - 1) * pageSize + pageSize
    );
    
    onPageChange(currentPageData);

  }, [currentPage, data, onPageChange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);


  return (
    <section className={cx({
      pagination: true,
      hide: data.length === 0,
    })}>
      <ul>
        <li>
          <Button
            icon='fa-solid fa-angle-left'
            className={classes.button}
            disabled={currentPage === 1}
            onClick={() => directionHandler(-1)}
          />
        </li>
          {
            pageNumbers.map(num => 
              <li key={num}>
                <Button
                  text={num}
                  className={cx({
                    button: true,
                    active: num === currentPage,
                  })}
                  onClick={() => setCurrentPage(num)}
                />
              </li>
            )
          }
        <li>
          <Button
            icon='fa-solid fa-angle-right'
            className={classes.button}
            disabled={currentPage === totalPageCount}
            onClick={() => directionHandler(1)}
          />
        </li>
      </ul>
    </section>
  )
}

export default Pagination;
