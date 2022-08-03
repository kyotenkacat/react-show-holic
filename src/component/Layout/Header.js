import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from 'store/auth-slice';
import Button from 'component/UI/Button';
import './Header.module.scss';

const Header = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const navigateToProfile = () => {
    if (user) {
      navigate('profile');
    } else {
      dispatch(
        authActions.setModalActive(true)
      );
    }
  };

  return (
    <header>
      <NavLink to="/">
        <img src={require('asset/img/logo.png')} alt="logo of Show Holic" />
      </NavLink>
      <nav>
        <ul>
          <li>
            <Button
              icon="fa-solid fa-user"
              text="個人頻道"
              className="primary"
              onClick={navigateToProfile}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
