import ReactDOM from 'react-dom';
import { Fragment, useEffect } from 'react';
import Button from 'component/UI/Button';
import classes from './Modal.module.scss';

const Modal = (props) => {

  const { onClose, onConfirm, className, children, hasAction, confirmText='確定' } = props;
  const body = document.getElementsByTagName('body')[0];

  useEffect(() => {
    body.style.top = `-${window.scrollY}px`;
    body.style.position = 'fixed';
    return () => {
      const scrollY = body.style.top;
      body.style = null;
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  },[body]);

  return (
    <Fragment>
      {
        ReactDOM.createPortal(
          <div className={classes.backdrop} onClick={onClose} />,
          body
        )
      }
      {
        ReactDOM.createPortal(
          <div id="modal" className={classes.modal + ' ' + className}>
            <Button
              icon='fa-solid fa-circle-xmark'
              className={classes.closeButton}
              onClick={onClose}
            />
            { children }
            {
              hasAction && <div className={classes.action}>
                <Button
                  text="取消"
                  className="cancel"
                  onClick={onClose}
                />
                <Button
                  text={confirmText}
                  className="primary"
                  onClick={onConfirm}
                />
              </div>
            }
          </div>,
          body
        )
      }
    </Fragment>
  );
};

export default Modal;
