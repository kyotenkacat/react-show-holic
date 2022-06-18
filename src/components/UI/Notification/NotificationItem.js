import { useState, useEffect } from 'react';
import classes from 'components/UI/Notification/NotificationItem.module.scss';

const Notification = ({item, autoClose, onRemove}) => {
  const [disappearing, setDisappearing] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => setDisappearing(true), 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoClose]);

  useEffect(() => {
    if (disappearing) {
      const timer = setTimeout(() => onRemove(item.id), 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [disappearing, onRemove, item.id]);

  const className = `${classes.notification} ${classes[item.type]} ${disappearing ? classes.disappearing : undefined}`

  return (
    <section className={className}>
      <p>{item.message}</p>
    </section>
  );
};

export default Notification;
