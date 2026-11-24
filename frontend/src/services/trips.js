import { collection, getDocs } from "firebase/firestore";
import { cities as catalogCities, destinations, journeys } from "../data/eastAfrica";
import { db } from "../firebase/firebase";

export function getDestinations() {
  return destinations;
}

export function getJourneys() {
  return journeys;
}

export function mergeCities(firestoreNames = []) {
  const seen = new Set();
  const merged = [];

  for (const value of [...catalogCities, ...firestoreNames]) {
    if (typeof value !== "string") continue;
    const name = value.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(name);
  }

  return merged.sort((a, b) => a.localeCompare(b));
}

export async function loadTrips() {
  const tripSnapshot = await getDocs(collection(db, "trips"));
  return tripSnapshot.docs
    .map((docItem) => {
      const data = docItem.data();
      const city = typeof (data.City || data.city) === "string" ? (data.City || data.city).trim() : "";
      return {
        id: docItem.id,
        city,
        country: data.Country || data.country || "",
        obligatoire: Boolean(data.Obligatoire ?? data.obligatoire),
      };
    })
    .filter((trip) => trip.city)
    .sort((a, b) => a.city.localeCompare(b.city));
}

export async function loadBookingCities() {
  try {
    const trips = await loadTrips();
    return trips.map((trip) => trip.city);
  } catch (error) {
    console.error("Unable to load booking cities:", error);
    return [];
  }
}

export async function loadRoutes() {
  const snapshot = await getDocs(collection(db, "routes"));
  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data(),
  }));
}

export async function searchRoutes(fromCity, toCity) {
  const normalize = (value) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";
  const from = normalize(fromCity);
  const to = normalize(toCity);

  const routes = await loadRoutes();

  return {
    matches: routes.filter(
      (route) => normalize(route.from) === from && normalize(route.to) === to
    ),
    routes,
  };
}
