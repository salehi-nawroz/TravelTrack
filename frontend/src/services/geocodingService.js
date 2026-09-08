import { geocodingApi, locationSearchApi } from "./api";

function createLocation({ cityName, country, countryCode, lat, lng }) {
  if (
    !cityName ||
    !country ||
    !countryCode ||
    !Number.isFinite(Number(lat)) ||
    !Number.isFinite(Number(lng))
  )
    return null;

  return {
    cityName,
    country,
    countryCode: countryCode.toUpperCase(),
    position: { lat, lng },
  };
}

function getSearchCityName(result) {
  const address = result.address || {};

  return (
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    result.name ||
    result.display_name?.split(",")[0]
  );
}

export function normalizeSearchLocation(result) {
  const address = result.address || {};

  return createLocation({
    cityName: getSearchCityName(result),
    country: address.country,
    countryCode: address.country_code,
    lat: Number(result.lat),
    lng: Number(result.lon),
  });
}

export async function getCityData(lat, lng) {
  const response = await geocodingApi.get("/reverse-geocode-client", {
    params: {
      latitude: lat,
      longitude: lng,
      localityLanguage: "en",
    },
  });

  const data = response.data;

  return createLocation({
    cityName: data.city || data.locality,
    country: data.countryName,
    countryCode: data.countryCode,
    lat: Number(lat),
    lng: Number(lng),
  });
}

export async function searchLocations(query) {
  const response = await locationSearchApi.get("/search", {
    params: {
      q: query,
      format: "jsonv2",
      addressdetails: 1,
      limit: 8,
    },
  });

  return response.data.map(normalizeSearchLocation).filter(Boolean);
}
