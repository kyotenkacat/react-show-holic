import { useState, useEffect } from 'react';
import classes from 'component/UI/Notification/NotificationItem.module.scss';

const Notification = (props) => {
  
  const { item, onRemove } = props;
  const [disappearing, setDisappearing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDisappearing(true), 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (disappearing) {
      const timer = setTimeout(() => onRemove(item.id), 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [disappearing, onRemove, item.id]);

  const className = `${classes.notification} ${classes[item.type]} ${disappearing ? classes.disappearing : undefined}`;

  return (
    <section className={className}>
      { item.type === 'success' && <i className="fa-solid fa-circle-check" /> }
      { item.type === 'error' && <i className="fa-solid fa-triangle-exclamation" /> }
      <span>{item.message}</span>
    </section>
  );
};

export default Notification;
