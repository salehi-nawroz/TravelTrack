import styles from "./City.module.css";

import { useParams, Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useEffect } from "react";
import Button from "./Button";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import FlagBox from "./FlagBox";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams();

  const { getCity, currentCity, isLoading } = useCities();

  useEffect(
    function () {
      getCity(id);
    },
    [id, getCity],
  );
  const { cityName, date, notes, countryCode, country } = currentCity;
  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        {/* <h3>
          <img className={styles.flag} src={flag} /> {cityName}
        </h3> */}
        <FlagBox countryCode={countryCode} country={country} position="left">
          {" "}
          <h3 style={{ marginLeft: 5 }}>{cityName}</h3>
        </FlagBox>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div className={styles.actions}>
        <Link to="edit">
          <Button type="primary">Edit</Button>
        </Link>
        <BackButton to="/app/cities" />
      </div>
    </div>
  );
}

export default City;
