import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadRoutes, loadTrips, searchRoutes as findRoutes } from "../services/trips";

function RouteCard({ route, onBook }) {
  return (
    <div className="route-card">
      <h3>
        {route.from} → {route.to}
      </h3>
      <p><strong>Company:</strong> {route.company || "N/A"}</p>
      <p><strong>Date:</strong> {route.date || "N/A"}</p>
      <p><strong>Departure:</strong> {route.departureTime || "N/A"}</p>
      <p><strong>Arrival:</strong> {route.arrivalTime || "N/A"}</p>
      <p><strong>Duration:</strong> {route.duration || "N/A"}</p>
      <p><strong>Available Seats:</strong> {route.availableSeats ?? "N/A"}</p>
      <p><strong>Price:</strong> {route.price != null && route.price !== "" ? `${route.currency || ""} ${route.price}`.trim() : "N/A"}</p>
      <button className="primary-btn" onClick={() => onBook(route)}>
        Book Now
      </button>
    </div>
  );
}

function BookingForm({ cities = [], loading = false }) {
  const availableCities = cities;
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [routes, setRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([loadRoutes(), loadTrips()])
      .then(([routeRows, tripRows]) => {
        if (!active) return;
        setAllRoutes(routeRows);
        setTrips(tripRows);
      })
      .catch((error) => {
        console.error("Error loading Firestore routes:", error);
        if (active) setMessage("Unable to fetch routes from Firestore right now.");
      });
    return () => {
      active = false;
    };
  }, []);

  const searchRoutes = async () => {
    if (!fromCity || !toCity) {
      setRoutes([]);
      setMessage("Please select both departure and destination cities.");
      return;
    }

    setSearching(true);
    setHasSearched(true);
    setMessage("");
    setRoutes([]);

    try {
      const { matches, routes: allRoutes } = await findRoutes(fromCity, toCity);

      setRoutes(matches);

      if (matches.length === 0) {
        const listed = allRoutes
          .map((route) => `${route.from} → ${route.to} (${route.currency || ""} ${route.price})`.trim())
          .join(", ");
        setMessage(
          listed
            ? `No route found from ${fromCity} to ${toCity}. Routes on file: ${listed}.`
            : `No route found from ${fromCity} to ${toCity}.`
        );
      }
    } catch (error) {
      console.error("Error searching routes:", error);
      setMessage("Unable to fetch routes from Firestore right now.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="booking">
      <h2>Find your trip</h2>
      <p className="booking-lead">Departure, destination, then the seats still open.</p>
      <div className="booking-fields">
      <select
        disabled={loading || searching}
        value={fromCity}
        onChange={(e) => setFromCity(e.target.value)}
      >
        <option value="">Select departure city</option>
        {loading ? (
          <option>Loading cities...</option>
        ) : availableCities.length === 0 ? (
          <option>No cities available</option>
        ) : (
          availableCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))
        )}
      </select>

      <select
        disabled={loading || searching}
        value={toCity}
        onChange={(e) => setToCity(e.target.value)}
      >
        <option value="">Select destination city</option>
        {loading ? (
          <option>Loading cities...</option>
        ) : availableCities.length === 0 ? (
          <option>No cities available</option>
        ) : (
          availableCities.map((city) => (
            <option key={`${city}-return`} value={city}>
              {city}
            </option>
          ))
        )}
      </select>

      <button onClick={searchRoutes} disabled={loading || searching}>
        {searching ? "Searching..." : loading ? "Loading..." : "Search"}
      </button>
      </div>

      {trips.length > 0 && (
        <div className="trip-towns">
          {trips.map((trip) => (
            <p key={trip.id}>
              <strong>{trip.city}</strong>
              {trip.country ? ` · ${trip.country}` : ""}
            </p>
          ))}
        </div>
      )}

      <div className="booking-results">
        {searching ? (
          <p>Searching routes...</p>
        ) : hasSearched && routes.length > 0 ? (
          routes.map((route) => (
            <RouteCard key={route.id} route={route} onBook={(selected) => navigate("/booking", { state: { route: selected } })} />
          ))
        ) : hasSearched ? (
          message && <p>{message}</p>
        ) : allRoutes.length > 0 ? (
          allRoutes.map((route) => (
            <RouteCard key={route.id} route={route} onBook={(selected) => navigate("/booking", { state: { route: selected } })} />
          ))
        ) : (
          message && <p>{message}</p>
        )}
      </div>
    </div>
  );
}

export default BookingForm;