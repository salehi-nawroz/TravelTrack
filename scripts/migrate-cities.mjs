// One-off migration: frontend/data/cities.json -> Supabase public.cities
//
// This script is intentionally dependency-free (uses Node's built-in fetch)
// so it can live outside frontend/node_modules and does not need any package
// installed at the repo root.
//
// Requires two environment variables, read from scripts/.env (gitignored,
// never committed) via Node's built-in --env-file flag:
//   SUPABASE_URL               - bare project URL, e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  - service_role key (trusted, local-only, never shipped to the browser)
//
// Run with:
//   node --env-file=scripts/.env scripts/migrate-cities.mjs
//
// This script only INSERTs. If public.cities already has any rows, it stops
// and reports rather than inserting duplicates or deleting anything.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CITIES_JSON_PATH = path.resolve(
  __dirname,
  "../frontend/data/cities.json",
);

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    console.error("See scripts/.env.example for the expected variables.");
    process.exit(1);
  }
  return value;
}

// Guards against pasting the URL with a trailing /rest/v1 (a mistake this
// same repo currently has in frontend/.env.local's VITE_SUPABASE_URL).
function normalizeBaseUrl(rawUrl) {
  return rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

// The stored value is a UTC ISO-8601 timestamp, e.g.
// "2026-09-08T17:04:37.174Z". We want only the calendar date the user
// selected, so we read the first 10 characters directly instead of going
// through a Date object - any local-timezone-aware conversion
// (toLocaleDateString, getDate/getMonth/getFullYear) could shift the date by
// a day depending on the machine's timezone.
function toVisitDate(isoTimestamp) {
  const match = /^(\d{4}-\d{2}-\d{2})T/.exec(isoTimestamp);
  if (!match) {
    throw new Error(`Unexpected date format: ${isoTimestamp}`);
  }
  return match[1];
}

function transformCity(city) {
  return {
    city_name: city.cityName,
    country: city.country,
    country_code: city.countryCode?.toUpperCase() ?? null,
    region: null, // not present in the existing json-server data; never invented
    notes: city.notes ?? "",
    latitude: Number(city.position.lat),
    longitude: Number(city.position.lng),
    visit_date: toVisitDate(city.date),
  };
}

async function getExistingRowCount(baseUrl, serviceRoleKey) {
  const response = await fetch(`${baseUrl}/rest/v1/cities?select=id`, {
    method: "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to check existing rows: ${response.status} ${await response.text()}`,
    );
  }

  const contentRange = response.headers.get("content-range"); // e.g. "0-0/26"
  const total = contentRange ? Number(contentRange.split("/")[1]) : NaN;
  return Number.isFinite(total) ? total : 0;
}

async function insertCities(baseUrl, serviceRoleKey, rows) {
  const response = await fetch(`${baseUrl}/rest/v1/cities`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(
      `Insert failed: ${response.status} ${await response.text()}`,
    );
  }

  return response.json();
}

async function main() {
  const rawUrl = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const baseUrl = normalizeBaseUrl(rawUrl);

  const fileContents = await readFile(CITIES_JSON_PATH, "utf-8");
  const { cities } = JSON.parse(fileContents);

  console.log(`Read ${cities.length} record(s) from ${CITIES_JSON_PATH}`);

  const existingCount = await getExistingRowCount(baseUrl, serviceRoleKey);

  if (existingCount > 0) {
    console.error(
      `public.cities already contains ${existingCount} row(s). Refusing to insert, to avoid creating duplicates.`,
    );
    console.error(
      "This script only performs a one-time import into an empty table and will not delete or overwrite anything automatically. " +
        "Decide deliberately what to do with the existing rows before re-running it.",
    );
    process.exit(1);
  }

  const rows = cities.map(transformCity);

  console.log("About to insert the following rows:");
  console.table(rows.map((row, i) => ({ legacy_id: cities[i].id, ...row })));

  const inserted = await insertCities(baseUrl, serviceRoleKey, rows);

  console.log(`Inserted ${inserted.length} row(s) into public.cities.`);
  console.log("legacy id -> new uuid mapping:");
  console.table(
    inserted.map((row, i) => ({
      legacy_id: cities[i]?.id,
      city_name: row.city_name,
      new_id: row.id,
    })),
  );
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exit(1);
});
