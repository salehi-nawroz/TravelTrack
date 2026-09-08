import styles from "./CountryItem.module.css";
import FlagBox from "./FlagBox";

function CountryItem({ country }) {
  console.log(country);
  return (
    <li className={styles.countryItem}>
      {/* <span>
        <img className={styles.flag} src={country.flag} />
      </span> */}
      <FlagBox countryCode={country.countryCode} country={country.country} />
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
