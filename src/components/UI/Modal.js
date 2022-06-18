import ReactDOM from 'react-dom';
import { Fragment } from 'react';

import Card from './Card';
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
          {props.children}
        </Card>,
        body
      )}
    </Fragment>
  );
};

export default Modal;