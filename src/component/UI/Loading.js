import classes from './Loading.module.scss';

const Loading = (props) => {

  return (
    <div className={classes.loading}>
      <i className="fa-solid fa-spinner" />
    </div>
  )
};

export default Loading;