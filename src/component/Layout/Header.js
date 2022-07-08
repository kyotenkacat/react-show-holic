import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signOutUser } from 'store/auth-slice';
import { authActions } from 'store/auth-slice';
import Button from 'component/UI/Button';
import classes from './Header.module.scss';

const MainHeader = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const className = ({ isActive }) => isActive ? classes.active : undefined;

  const signOutHandler = () => {
    dispatch(signOutUser());
  }

  const navigateToProfile = () => {
    if (user) {
      navigate('profile');
    } else {
      dispatch(
        authActions.setModalActive(true)
      );
    }
  }

  return (
    <header className={classes.header}>
      <h1><NavLink to="/" className={className}>Show Holic</NavLink></h1>
      <nav>
        <ul>
          <li>
            <Button
              icon="fa-solid fa-user"
              text="個人頻道"
              className={classes.button}
              onClick={navigateToProfile}
            />
            <Button
              text="登出"
              className={classes.button}
              onClick={signOutHandler}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;