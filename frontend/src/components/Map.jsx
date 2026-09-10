import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";
import FlagBox from "./FlagBox";
import LocationSearch from "./LocationSearch";

function Map() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [searchParams] = useSearchParams();
  const isSelectingLocation = searchParams.get("selectLocation") === "true";
  const { lat: mapLat, lng: mapLng } = useUrlPosition();

  function handleSearchSelect(selectedLocation) {
    const path = isSelectingLocation ? location.pathname : "/app/form";
    const selectionMode = isSelectingLocation ? "selectLocation=true&" : "";

    navigate(
      `${path}?${selectionMode}locationSource=mapSearch&lat=${selectedLocation.position.lat}&lng=${selectedLocation.position.lng}`,
    );
  }
  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      <LocationSearch onSelect={handleSearchSelect} variant="map" />
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "loading..." : "Use your position"}
        </Button>
      )}

      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        zoomControl={false}
        className={`${styles.map} ${isSelectingLocation ? styles.selecting : ""}`}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                <FlagBox countryCode={city.countryCode} position="left" />
              </span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {mapLat && mapLng && (
          <Marker position={[mapLat, mapLng]}>
            <Popup>Selected location</Popup>
          </Marker>
        )}
        <ChangeCenter position={mapPosition} />
        <DetectClick isSelectingLocation={isSelectingLocation} />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick({ isSelectingLocation }) {
  const navigate = useNavigate();
  const location = useLocation();
  useMapEvents({
    click: (e) => {
      const coordinates = `lat=${e.latlng.lat}&lng=${e.latlng.lng}`;

      navigate(
        isSelectingLocation
          ? `${location.pathname}?selectLocation=true&${coordinates}`
          : `form?${coordinates}`,
      );
    },
  });
}

export default Map;
