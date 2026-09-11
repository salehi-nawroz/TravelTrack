import { getContinentName } from "@brixtol/country-continent";

export function getContinent(countryCode) {
  return getContinentName(countryCode) || "Other";
}
