import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./AppNav.module.css";
function AppNav() {
  const { isAdmin, isSuperAdmin } = useAuth();

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="countries"> Countries</NavLink>
        </li>
        <li>
          <NavLink to="cities"> Cities</NavLink>
        </li>
        {(isAdmin || isSuperAdmin) && (
          <li>
            <NavLink to="admin"> Admin</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default AppNav;
