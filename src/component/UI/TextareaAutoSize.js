import { Fragment, useState, forwardRef } from 'react';
import { isFunction } from 'lodash';
import classes from './TextareaAutoSize.module.scss';

const TextareaAutoSize = forwardRef((props, ref) => {

  const { minRows, maxRows, maxLength, defaultValue, onChange, title } = props;
  const [rows, setRows] = useState(minRows);
  const [length, setLength] = useState(defaultValue?.length);
  const [showLength, setShowLength] = useState(false);
  
  const changeHandler = (event) => {
    // font-size: 16px
    // line-height: 1.4
    // padding: 10px
    const lineHeight = 16 * 1.4; // 22.4
    const padding = 20;
    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea in case content decreased
    const currentRows = Math.round((event.target.scrollHeight - padding) / lineHeight);
    if (currentRows === previousRows) {
        event.target.rows = currentRows;
    }
    if (currentRows >= maxRows) {
        event.target.rows = maxRows;
    }
    setRows(currentRows < maxRows ? currentRows : maxRows);
    setLength(ref.current.value?.length);
    if (!showLength && ref.current.value?.length === maxLength) {
      setShowLength(true);
    }
    if (isFunction(onChange)) {
      onChange();
    }
  };

  return (
    <Fragment>
      <label htmlFor={title} className={classes.title}>
        { title }
        {
          showLength && <span> ({ length }/{ maxLength })</span>
        }        
      </label>
      <textarea
        id={title}
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        defaultValue={defaultValue}
        autoComplete="off"
        className={classes.textareaAutoSize}
        onChange={changeHandler}
      />
    </Fragment>
  );
});
export default TextareaAutoSize;
