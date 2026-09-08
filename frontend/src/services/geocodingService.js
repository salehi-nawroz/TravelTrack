import { geocodingApi } from "./api";

export async function getCityData(lat, lng) {
  const response = await geocodingApi.get("/reverse-geocode-client", {
    params: {
      latitude: lat,
      longitude: lng,
      localityLanguage: "en",
    },
  });

  return response.data;
}
