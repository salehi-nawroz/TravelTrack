import supabase from "./supabaseClient";

// Postgres `visit_date` is a DATE (e.g. "2026-09-08"), with no time or
// timezone component. Parsing that string with `new Date(...)` would be
// interpreted as UTC midnight, which can then display as the previous day
// for viewers in a negative UTC-offset timezone. Building the Date from its
// year/month/day parts via the local constructor avoids any UTC conversion.
function dbDateToLocalDate(visitDate) {
  const [year, month, day] = visitDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

// The inverse: read the calendar date the user actually picked using local
// getters only, never toISOString() (which would convert through UTC and
// risks shifting the date by a day depending on the time of day and the
// viewer's timezone offset).
function localDateToDbDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDomainCity(row) {
  return {
    id: row.id,
    cityName: row.city_name,
    country: row.country,
    countryCode: row.country_code,
    date: dbDateToLocalDate(row.visit_date),
    notes: row.notes,
    region: row.region ?? null,
    position: {
      lat: row.latitude,
      lng: row.longitude,
    },
  };
}

function toDbRow(city) {
  return {
    city_name: city.cityName,
    country: city.country,
    country_code: city.countryCode,
    region: city.region ?? null,
    notes: city.notes ?? "",
    latitude: city.position.lat,
    longitude: city.position.lng,
    visit_date: localDateToDbDate(city.date),
  };
}

export async function getCities() {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data.map(toDomainCity);
}

export async function getCity(id) {
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return toDomainCity(data);
}

export async function createCity(city) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User is not authenticated.");

  const { data, error } = await supabase
    .from("cities")
    .insert({ ...toDbRow(city), user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return toDomainCity(data);
}

export async function updateCity(id, city) {
  const { data, error } = await supabase
    .from("cities")
    .update(toDbRow(city))
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return toDomainCity(data);
}

export async function deleteCity(id) {
  const { error } = await supabase.from("cities").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
