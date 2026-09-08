import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <Link to="/">
      <span className={styles.logo} aria-label="TravelTrack home">
        <img src="/icon.png" alt="" className={styles.icon} />
        <span className={styles.wordmark}>TravelTrack</span>
      </span>
    </Link>
  );
}

export default Logo;
