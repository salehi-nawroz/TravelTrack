import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styles from "./CountryItem.module.css";
import FlagBox from "./FlagBox";

function CountryItem({ country, cities }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const countryCode = cities[0]?.countryCode;
  const { lat: countryLat, lng: countryLng } = cities[0].position;

  const visibleCities = isExpanded ? cities : cities.slice(0, 3);
  const remainingCount = cities.length - 3;

  function handleCountryClick() {
    navigate(`/app/countries?lat=${countryLat}&lng=${countryLng}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCountryClick();
    }
  }

  return (
    <div
      className={styles.countryItem}
      onClick={handleCountryClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className={styles.countryHeader}>
        <FlagBox countryCode={countryCode} country={country} position="left" />

        <span>{country}</span>
      </div>

      <ul className={styles.cityList}>
        {visibleCities.map((city) => (
          <li key={city.id}>
            <Link
              to={`/app/cities/${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
              onClick={(e) => e.stopPropagation()}
            >
              {city.cityName}
            </Link>
          </li>
        ))}
      </ul>

      {cities.length > 3 && (
        <button
          className={styles.moreButton}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded((expanded) => !expanded);
          }}
        >
          {isExpanded ? "Show less" : `+ ${remainingCount} more`}
        </button>
      )}
    </div>
  );
}

export default CountryItem;
