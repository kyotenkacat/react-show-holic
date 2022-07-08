import { useState, forwardRef } from 'react';
import { isFunction } from 'lodash';
import classes from './TextareaAutoSize.module.scss';

const TextareaAutoSize = forwardRef((props, ref) => {

  const { minRows, maxRows, maxLength, defaultValue, onChange } = props;

  // fix me, 有可能初始就超過minRows
  const [rows, setRows] = useState(minRows);

  const changeHandler = (event) => {
    // font-size: 16px
    // line-height: 1.15
    // padding: 10px
    const lineHeight = 16 * 1.15; // 18.4
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
    if (isFunction(onChange)) {
      onChange();
    }
  }

  return (
    <textarea
      rows={rows}
      maxLength={maxLength}
      defaultValue={defaultValue}
      autoComplete="off"
      className={classes.textareaAutoSize}
      onChange={changeHandler}
      ref={ref}
    />
  )
})
export default TextareaAutoSize;
