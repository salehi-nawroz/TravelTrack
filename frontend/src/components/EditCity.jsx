import styles from "./City.module.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import BackButton from "./BackButton";

function EditCity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getCity, currentCity, isLoading, updateCity } = useCities();

  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  // Get the city when the component loads
  useEffect(
    function () {
      getCity(id);
    },
    [id, getCity],
  );

  // Put current city data into our form
  useEffect(
    function () {
      if (currentCity.id) {
        setCityName(currentCity.cityName || "");
        setDate(currentCity.date || "");
        setNotes(currentCity.notes || "");
      }
    },
    [currentCity],
  );

  if (isLoading) return <Spinner />;

  async function handleSubmit(e) {
    e.preventDefault();

    const updatedCity = {
      ...currentCity,
      cityName,
      date,
      notes,
    };

    await updateCity(id, updatedCity);

    navigate(`/app/cities/${id}`);
  }

  return (
    <form className={styles.city} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <h6>City name</h6>

        <input
          type="text"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder="City name"
        />
      </div>

      <div className={styles.row}>
        <h6>Date</h6>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <h6>Your notes</h6>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Your notes..."
        />
      </div>

      <div className={styles.row}>
        <button type="submit">Save Changes</button>
      </div>

      <div>
        <BackButton />
      </div>
    </form>
  );
}

export default EditCity;
