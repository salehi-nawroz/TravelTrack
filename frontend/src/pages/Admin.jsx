import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllProfiles } from "../services/profileService";
import { getCities, deleteCity as deleteCityApi } from "../services/cityService";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import ConfirmDialog from "../components/ConfirmDialog";
import styles from "./Admin.module.css";

function Admin() {
  const { isAdmin, isSuperAdmin } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cityPendingDelete, setCityPendingDelete] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const [profilesData, citiesData] = await Promise.all([
          getAllProfiles(),
          getCities(),
        ]);
        if (isMounted) {
          setProfiles(profilesData);
          setCities(citiesData);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAdmin && !isSuperAdmin) return <Navigate replace to="/app" />;

  const citiesByUserId = cities.reduce((acc, city) => {
    (acc[city.userId] ??= []).push(city);
    return acc;
  }, {});

  async function handleConfirmDeleteCity() {
    const city = cityPendingDelete;
    setCityPendingDelete(null);
    try {
      await deleteCityApi(city.id);
      setCities((current) => current.filter((c) => c.id !== city.id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.admin}>
      <div className={styles.section}>
        <h2>Users</h2>

        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        {!profiles.length ? (
          <Message message="No users found." />
        ) : (
          <ul className={styles.list}>
            {profiles.map((profile) => {
              const userCities = citiesByUserId[profile.id] || [];

              return (
                <li key={profile.id} className={styles.userGroup}>
                  <div className={styles.listRow}>
                    <span>{profile.full_name || "(no name)"}</span>
                    <span className={styles.role}>{profile.role}</span>
                  </div>

                  {userCities.length ? (
                    <ul className={styles.cityList}>
                      {userCities.map((city) => (
                        <li key={city.id} className={styles.cityRow}>
                          <span>
                            {city.cityName}, {city.country}
                          </span>
                          <div className={styles.actions}>
                            <Link to={`/app/cities/${city.id}/edit`}>
                              Edit
                            </Link>
                            {isSuperAdmin && (
                              <button
                                className={styles.deleteBtn}
                                onClick={() => setCityPendingDelete(city)}
                                aria-label={`Delete ${city.cityName}`}
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noCities}>No cities yet.</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {cityPendingDelete && (
        <ConfirmDialog
          title="Delete city?"
          message={`Are you sure you want to delete ${cityPendingDelete.cityName}?`}
          onConfirm={handleConfirmDeleteCity}
          onCancel={() => setCityPendingDelete(null)}
        />
      )}
    </div>
  );
}

export default Admin;
