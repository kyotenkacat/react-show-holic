import classes from './Button.module.scss';

const Button = (props) => {
  const clickHandler = () => {
    if (props.onClick) {
      props.onClick();
    }
  }

  return (
    <button
      className={classes.button + ' ' + props.className}
      onClick={clickHandler}
    >
      { props.icon && <i className={props.icon} /> }
      { props.text && <span>{props.text}</span> }
    </button>
  );
};

export default Button;
