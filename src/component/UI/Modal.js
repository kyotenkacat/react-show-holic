import ReactDOM from 'react-dom';
import { Fragment } from 'react';
import Card from './Card';
import Button from 'component/UI/Button';
import classes from './Modal.module.scss';

const Modal = (props) => {
  const body = document.getElementsByTagName('body')[0];

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <div className={classes.backdrop} onClick={props.onClose} />,
        body
      )}
      {ReactDOM.createPortal(
        <Card className={classes.modal + ' ' + props.className}>
          <Button
            icon='fa-solid fa-circle-xmark'
            className={classes.closeButton}
            onClick={props.onClose}
          />
          {props.children}
        </Card>,
        body
      )}
    </Fragment>
  );
};

export default Modal;