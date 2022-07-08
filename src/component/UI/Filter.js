import { useReducer, useEffect, useRef } from 'react';
import { constant } from 'asset/constant';
import Button from 'component/UI/Button';
import { map, orderBy, cloneDeep, lowerCase, trim } from 'lodash';
import classes from './Filter.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const filterReducer = (state, { type, payload}) => {
  switch (type) {
    case 'CHANGE_KEYWORD':
      return {
        ...state,
        filter: { ...state.filter, keyword: payload.keyword },
      };
    case 'CHANGE_TYPE':
      return {
        ...state,
        filter: { ...state.filter, type: payload.type },
      };
    case 'CHANGE_PLATFORM':
      return {
        ...state,
        filter: { ...state.filter, platform: payload.platform },
      };
    case 'CHANGE_YEAR':
      return {
        ...state,
        filter: { ...state.filter, year: payload.year },
      };
    case 'CHANGE_SORT':
      const newVariable = {
        ...state,
        sort: payload.sort
      };
      return newVariable;
    default:
  }
};

const SORT_OPTIONS = [
  { name: '最好評', field: 'rating', order: 'desc' },
  { name: '最負評', field: 'rating', order: 'asc' },
  { name: '最新', field: 'publishedDate', order: 'desc' },
  { name: '最舊', field: 'publishedDate', order: 'asc' },
]

const INITIAL_STATE = {
  filter: {
    keyword: null,
    type: null, // 類型： 電視 電影
    platform: null, // 平台：
    year: null, // 年份：
  },
  sort: SORT_OPTIONS[0],
};

const Filter = (props) => {
  
  const [condition, dispatch] = useReducer(filterReducer, INITIAL_STATE);
  const keywordRef = useRef();

  const keywordHandler = (e) => {
    dispatch({ type: "CHANGE_KEYWORD", payload: { keyword: keywordRef.current.value } });
  };

  const typeHandler = (type) => {
    dispatch({ type: "CHANGE_TYPE", payload: { type } });
  };
  
  const platformHandler = (platform) => {
    dispatch({ type: "CHANGE_PLATFORM", payload: { platform } });
  };
  
  const yearHandler = (year) => {
    dispatch({ type: "CHANGE_YEAR", payload: { year } });
  };
  
  const sortHandler = (sort) => {
    dispatch({ type: "CHANGE_SORT", payload: { sort } });
  };

  const { data, onFilter } = props;

  useEffect(() => {
    const { filter, sort } = condition;
    const cloneData = cloneDeep(data);

    let filteredData = cloneData.filter((show) => {
      let match = true;
      if (filter.keyword) {
        const keyword = lowerCase(trim(filter.keyword));
        match = lowerCase(show.title).includes(keyword) ||
          lowerCase(show.originalTitle).includes(keyword) ||
          lowerCase(show.description).includes(keyword)
      }

      if (match && filter.year) {
        match = show.publishedDate.includes(filter.year)
      }

      if (match && filter.type) {
        match = show.type === filter.type;
      }
      
      if (match && filter.platform) {
        match = show.platform === filter.platform;
      }

      return match;
    })

    filteredData = orderBy(filteredData, sort.field, sort.order);
    
    onFilter(filteredData);
    
  }, [condition, data, onFilter]);

  const allButton = (item, handler) => {
    return <Button
      text='所有'
      className={cx({
        button: true,
        active: !condition.filter[item],
      })}
      onClick={() => handler(null)}
    />
  }

  return (
    <section className={classes.filter}>
      <p>
        <span className={classes.title}>類型</span>
        {allButton('type', typeHandler)}
        {
          map(constant.type, (item, key) => 
            <Button
              key={key}
              text={item}
              className={cx({
                button: true,
                active: Number(key) === condition.filter.type,
              })}
              onClick={() => typeHandler(Number(key))}
            />
          )
        }
      </p>
      <p>
        <span className={classes.title}>平台</span>
        {allButton('platform', platformHandler)}
        {
          map(constant.platform, (item, key) => 
            <Button
              key={key}
              text={item}
              className={cx({
                button: true,
                active: Number(key) === condition.filter.platform,
              })}
              onClick={() => platformHandler(Number(key))}
            />
          )
        }
      </p>
      <p>
        <span className={classes.title}>年份</span>
        {allButton('year', yearHandler)}
        {
          // fix me, 更舊的年份如何處理
          map([2022, 2021, 2020, 2019], item =>
            <Button
              key={item}
              text={item}
              className={cx({
                button: true,
                active: item === condition.filter.year,
              })}
              onClick={() => yearHandler(item)}
            />
          )
        }
      </p>
      <p>
        <span className={classes.title}>排序</span>
        {
          map(SORT_OPTIONS, item =>
            <Button
              key={item.name}
              text={item.name}
              className={cx({
                button: true,
                active: item.field === condition.sort.field && item.order === condition.sort.order,
              })}
              onClick={() => sortHandler(item)}
            />
          )
        }
      </p>
      <p className={classes.search}>
        <span className={classes.title}>搜尋</span>
        <input
          type="text"
          name="search"
          maxLength="20"
          autoComplete="off"
          spellCheck="false"
          ref={keywordRef}
        />
        {/* fix me 按enter時也觸發搜尋 */}
        <Button
          icon='fa-solid fa-magnifying-glass'
          className={classes.button}
          onClick={() => keywordHandler(null)}
        />
      </p>
    </section>
  );
};

export default Filter;
