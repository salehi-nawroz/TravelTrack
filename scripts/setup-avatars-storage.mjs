// One-off setup: create the private "avatars" Storage bucket used for
// TravelTrack profile pictures. Mirrors migrate-cities.mjs's local-only,
// dependency-free, service-role pattern.
//
// Requires scripts/.env (gitignored, never committed) via Node's built-in
// --env-file flag:
//   SUPABASE_URL               - bare project URL, e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY  - service_role key (trusted, local-only, never shipped to the browser)
//
// Run with:
//   node --env-file=scripts/.env scripts/setup-avatars-storage.mjs
//
// This script only creates the bucket if it does not already exist. It does
// NOT create or modify Storage RLS policies - those are plain SQL and must
// be run once, manually, in the Supabase SQL Editor. See
// scripts/avatars-storage-policies.sql for the exact statements.

const BUCKET_ID = "avatars";
const FILE_SIZE_LIMIT_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    console.error("See scripts/.env.example for the expected variables.");
    process.exit(1);
  }
  return value;
}

// Guards against pasting the URL with a trailing /storage/v1 (the same
// mistake this repo already guards against in migrate-cities.mjs for
// /rest/v1).
function normalizeBaseUrl(rawUrl) {
  return rawUrl.trim().replace(/\/storage\/v1\/?$/, "").replace(/\/+$/, "");
}

async function bucketExists(baseUrl, serviceRoleKey) {
  const response = await fetch(`${baseUrl}/storage/v1/bucket/${BUCKET_ID}`, {
    method: "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (response.status === 200) return true;
  if (response.status === 404) return false;

  const bodyText = await response.text();

  // Supabase Storage's single-bucket GET returns HTTP 400 (not 404) for a
  // missing bucket, with the actual "not found" signal only inside the JSON
  // body (statusCode "404", code "NoSuchBucket"). Treat that specific shape
  // as "does not exist" - any other 400, or a body that doesn't match, still
  // fails the script below.
  if (response.status === 400) {
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      body = null;
    }

    if (body?.code === "NoSuchBucket" || body?.statusCode === "404") {
      return false;
    }
  }

  throw new Error(`Failed to check bucket: ${response.status} ${bodyText}`);
}

async function createBucket(baseUrl, serviceRoleKey) {
  const response = await fetch(`${baseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: BUCKET_ID,
      name: BUCKET_ID,
      public: false,
      file_size_limit: FILE_SIZE_LIMIT_BYTES,
      allowed_mime_types: ALLOWED_MIME_TYPES,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create bucket: ${response.status} ${await response.text()}`,
    );
  }

  return response.json();
}

async function main() {
  const rawUrl = requireEnv("SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const baseUrl = normalizeBaseUrl(rawUrl);

  if (await bucketExists(baseUrl, serviceRoleKey)) {
    console.log(`Bucket "${BUCKET_ID}" already exists. Nothing to do.`);
    return;
  }

  const bucket = await createBucket(baseUrl, serviceRoleKey);

  console.log(`Created private bucket "${bucket.name}".`);
  console.log(
    "Next: run scripts/avatars-storage-policies.sql once in the Supabase SQL Editor to set up access policies.",
  );
}

main().catch((error) => {
  console.error("Setup failed:", error.message);
  process.exit(1);
});
