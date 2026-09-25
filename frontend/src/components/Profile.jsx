import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import styles from "./Profile.module.css";

function Profile() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFullName(profile?.full_name || "");
  }, [profile]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSaving) return;

    setError("");
    setIsSaving(true);
    try {
      await updateProfile({ full_name: fullName });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel(e) {
    e.preventDefault();
    navigate("/app");
  }

  if (!user) return null;

  const displayName = profile?.full_name || user.email;

  return (
    <main className={styles.profile}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Your profile</h2>

        <div className={styles.avatarRow}>
          <img src="/user.png" alt={user.email} className={styles.avatar} />
          <div>
            <p className={styles.name}>{displayName}</p>
            <p className={styles.email}>{user.email}</p>
          </div>
        </div>

        {!profile ? (
          <Spinner />
        ) : (
          <div className={styles.row}>
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
          </div>
        )}

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        <div className={styles.buttons}>
          <Button type="primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button type="back" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}

export default Profile;
