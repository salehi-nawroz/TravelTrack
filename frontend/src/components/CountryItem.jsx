import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "./CountryItem.module.css";
import FlagBox from "./FlagBox";

function CountryItem({ country, cities }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const countryCode = cities[0]?.countryCode;

  const visibleCities = isExpanded ? cities : cities.slice(0, 3);
  const remainingCount = cities.length - 3;

  return (
    <div className={styles.countryItem}>
      <div className={styles.countryHeader}>
        <FlagBox countryCode={countryCode} country={country} />

        <span>{country}</span>
      </div>

      <ul className={styles.cityList}>
        {visibleCities.map((city) => (
          <li key={city.id}>
            <Link
              to={`/app/cities/${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
            >
              {city.cityName}
            </Link>
          </li>
        ))}
      </ul>

      {cities.length > 3 && (
        <button
          className={styles.moreButton}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? "Show less" : `+ ${remainingCount} more`}
        </button>
      )}
    </div>
  );
}

export default CountryItem;
