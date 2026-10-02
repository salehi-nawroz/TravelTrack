import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAllProfiles } from "../services/profileService";
import { getCities, deleteCity as deleteCityApi } from "../services/cityService";
import Spinner from "../components/Spinner";
import Message from "../components/Message";
import ConfirmDialog from "../components/ConfirmDialog";
import FlagBox from "../components/FlagBox";
import styles from "./Admin.module.css";

const ROLE_LABELS = {
  user: "User",
  admin: "Admin",
  super_admin: "Super Admin",
};

function groupByCountry(cities) {
  return cities.reduce((acc, city) => {
    (acc[city.country] ??= []).push(city);
    return acc;
  }, {});
}

function Admin() {
  const { isAdmin, isSuperAdmin } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [profilesError, setProfilesError] = useState("");

  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  const [cityPendingDelete, setCityPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const [activeTab, setActiveTab] = useState("users");

  // Users and cities are fetched independently so that one failing doesn't
  // prevent the other section from loading and displaying normally.
  useEffect(() => {
    let isMounted = true;

    async function loadProfiles() {
      setIsLoadingProfiles(true);
      setProfilesError("");
      try {
        const data = await getAllProfiles();
        if (isMounted) setProfiles(data);
      } catch (err) {
        console.error("Failed to load users:", err.message);
        if (isMounted) {
          setProfilesError("Could not load users. Please try again.");
        }
      } finally {
        if (isMounted) setIsLoadingProfiles(false);
      }
    }

    loadProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCities() {
      setIsLoadingCities(true);
      setCitiesError("");
      try {
        const data = await getCities();
        if (isMounted) setCities(data);
      } catch (err) {
        console.error("Failed to load cities:", err.message);
        if (isMounted) {
          setCitiesError("Could not load cities. Please try again.");
        }
      } finally {
        if (isMounted) setIsLoadingCities(false);
      }
    }

    loadCities();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAdmin && !isSuperAdmin) return <Navigate replace to="/app" />;

  const nameById = Object.fromEntries(
    profiles.map((profile) => [profile.id, profile.full_name]),
  );
  const roleById = Object.fromEntries(
    profiles.map((profile) => [profile.id, profile.role]),
  );

  const citiesByUserId = cities.reduce((acc, city) => {
    (acc[city.userId] ??= []).push(city);
    return acc;
  }, {});

  const userIdsWithCities = Object.keys(citiesByUserId).sort((a, b) =>
    (nameById[a] || "Unknown user").localeCompare(nameById[b] || "Unknown user"),
  );

  async function handleConfirmDeleteCity() {
    const city = cityPendingDelete;
    setCityPendingDelete(null);
    setDeleteError("");
    try {
      await deleteCityApi(city.id);
      setCities((current) => current.filter((c) => c.id !== city.id));
    } catch (err) {
      console.error("Failed to delete city:", err.message);
      setDeleteError("Could not delete this city. Please try again.");
    }
  }

  return (
    <div className={styles.admin}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tabButton} ${activeTab === "users" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
          {!isLoadingProfiles && !profilesError && ` (${profiles.length})`}
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "cities" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("cities")}
        >
          Cities
          {!isLoadingCities && !citiesError && ` (${cities.length})`}
        </button>
      </div>

      {activeTab === "users" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Users
            {!isLoadingProfiles && !profilesError && (
              <span className={styles.count}>({profiles.length})</span>
            )}
          </h2>

          {isLoadingProfiles ? (
            <Spinner />
          ) : profilesError ? (
            <p className={styles.error}>{profilesError}</p>
          ) : !profiles.length ? (
            <Message message="No users found." />
          ) : (
            <ul className={styles.list}>
              <li className={`${styles.listRow} ${styles.listHeaderRow}`}>
                <span>Name</span>
                <span>Role</span>
              </li>
              {profiles.map((profile) => (
                <li key={profile.id} className={styles.listRow}>
                  <span>{profile.full_name || "(no name)"}</span>
                  <span
                    className={`${styles.role} ${styles[`role-${profile.role}`] || ""}`}
                  >
                    {ROLE_LABELS[profile.role] || profile.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "cities" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Cities
            {!isLoadingCities && !citiesError && (
              <span className={styles.count}>({cities.length})</span>
            )}
          </h2>

          {deleteError && <p className={styles.error}>{deleteError}</p>}

          {isLoadingCities ? (
            <Spinner />
          ) : citiesError ? (
            <p className={styles.error}>{citiesError}</p>
          ) : !cities.length ? (
            <Message message="No cities found." />
          ) : (
            <ul className={styles.userGroups}>
              {userIdsWithCities.map((userId) => {
                const userCities = citiesByUserId[userId];
                const countries = groupByCountry(userCities);
                const role = roleById[userId];

                return (
                  <li key={userId} className={styles.userGroup}>
                    <div className={styles.userGroupHeading}>
                      <span>{nameById[userId] || "Unknown user"}</span>
                      {role && (
                        <span
                          className={`${styles.role} ${styles[`role-${role}`] || ""}`}
                        >
                          {ROLE_LABELS[role] || role}
                        </span>
                      )}
                    </div>

                    {Object.entries(countries).map(
                      ([country, countryCities]) => (
                        <div key={country} className={styles.countryItem}>
                          <div className={styles.countryHeader}>
                            <FlagBox
                              countryCode={countryCities[0]?.countryCode}
                              country={country}
                              position="left"
                            />
                            <span>{country}</span>
                          </div>

                          <ul className={styles.cityList}>
                            {countryCities.map((city) => (
                              <li key={city.id} className={styles.cityRow}>
                                <Link
                                  to={`/app/cities/${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
                                >
                                  {city.cityName}
                                </Link>
                                <span className={styles.actions}>
                                  <Link to={`/app/cities/${city.id}/edit`}>
                                    Edit
                                  </Link>
                                  {isSuperAdmin && (
                                    <button
                                      className={styles.deleteBtn}
                                      onClick={() =>
                                        setCityPendingDelete(city)
                                      }
                                      aria-label={`Delete ${city.cityName}`}
                                    >
                                      &times;
                                    </button>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

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
