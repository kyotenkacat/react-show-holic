// import CartButton from '../Cart/CartButton';
import { NavLink } from "react-router-dom";
import classes from './MainHeader.module.scss';
import Button from "components/UI/Button";

const MainHeader = (props) => {
  const className = ({ isActive }) => isActive ? classes.active : undefined;

  return (
    <header className={classes.header}>
      <h1><NavLink to="/" className={className}>Show Holic</NavLink></h1>
      <nav>
        <ul>
          <li>
            <NavLink
              to="favorite"
              className={className}
            >
              <Button 
                icon="fa-solid fa-heart"
                text="收藏清單"
                className={classes.button}
              />
            </NavLink>
            {/* <CartButton /> */}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;