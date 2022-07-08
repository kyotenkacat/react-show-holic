import { useSelector, useDispatch } from 'react-redux';
import { uiActions } from 'store/ui-slice';
import NotificationItem from 'component/UI/Notification/NotificationItem';
import classes from 'component/UI/Notification/NotificationList.module.scss';

const Notification = (props) => {
  const dispatch = useDispatch();
  const notificationList = useSelector((state) => state.ui.notificationList);

  const removeNotification = (id) => {
    dispatch(uiActions.removeNotification({ id }))
  }

  return (
    <div className={classes.notificationList}>
      {
        notificationList.map((item) => 
          <NotificationItem key={item.id} item={item} autoClose={true} onRemove={(id)=>{removeNotification(id)}} />
        )
      }
    </div>
  );
};

export default Notification;
