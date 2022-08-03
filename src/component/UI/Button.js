import classes from './Button.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Button = (props) => {

  const clickHandler = (e) => {
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <button
      disabled={props.disabled}
      className={cx({
        button: true,
        [props.className]: true,
        disabled: props.disabled,
      })}
      onClick={clickHandler}
    >
      { props.icon && <i className={props.icon} /> }
      { props.text && <span>{props.text}</span> }
    </button>
  );
};

export default Button;
