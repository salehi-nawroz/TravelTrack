import api from "./api";

export async function getCities() {
  const response = await api.get("/cities");
  return response.data;
}

export async function getCity(id) {
  const response = await api.get(`/cities/${id}`);
  return response.data;
}

export async function createCity(city) {
  const response = await api.post("/cities", city);
  return response.data;
}

export async function updateCity(id, city) {
  const response = await api.put(`/cities/${id}`, city);
  return response.data;
}

export async function deleteCity(id) {
  await api.delete(`/cities/${id}`);
}
