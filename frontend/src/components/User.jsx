import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleClick() {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to log out:", err.message);
    }
  }

  if (!user) return null;

  return (
    <div className={styles.user}>
      <img src="/user.png" alt={user.email} />
      <span>{user.email}</span>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
}

export default User;
