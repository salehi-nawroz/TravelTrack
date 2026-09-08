import { useState } from "react";
import Spinner from "./Spinner";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

function CityList() {
  const { cities, isLoading } = useCities();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <Spinner />;

  if (!cities.length) {
    return (
      <Message message="Enter your first city by clicking on a city on the map" />
    );
  }

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const hasSearchQuery = Boolean(normalizedSearchTerm);

  function normalizeSearchValue(value) {
    return typeof value === "string" ? value.toLowerCase() : "";
  }

  const filteredCities = cities.filter((city) => {
    if (!hasSearchQuery) return true;

    return (
      normalizeSearchValue(city.cityName).includes(normalizedSearchTerm) ||
      normalizeSearchValue(city.country).includes(normalizedSearchTerm)
    );
  });

  function handleClearSearch() {
    setSearchTerm("");
  }

  return (
    <>
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon} aria-hidden="true">
            &#128269;
          </span>

          <input
            type="text"
            placeholder="Search cities or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search cities or countries"
          />

          {hasSearchQuery && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <div className={styles.searchInfo} aria-live="polite">
          <span>
            {filteredCities.length}{" "}
            {filteredCities.length === 1 ? "city" : "cities"}
          </span>

          {hasSearchQuery && (
            <button
              type="button"
              className={styles.clearTextButton}
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {!filteredCities.length && hasSearchQuery ? (
        <Message
          message={`No cities found for "${normalizedSearchTerm}". Clear the search or try another city or country.`}
        />
      ) : (
        <ul className={styles.cityList}>
          {filteredCities.map((city) => (
            <CityItem city={city} key={city.id} />
          ))}
        </ul>
      )}
    </>
  );
}

export default CityList;
