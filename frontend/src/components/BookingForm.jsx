import { useEffect, useRef, useState } from "react";
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

function CitySelect({ label, value, cities, trips, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const countryOf = (city) => trips.find((trip) => trip.city === city)?.country || "East Africa";

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className={`city-select ${open ? "is-open" : ""}`} ref={rootRef}>
      <button
        type="button"
        className="city-select-trigger"
        disabled={disabled}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>
          <small>Choose</small>
          <strong>{value || label}</strong>
        </span>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
      <div className="city-select-panel">
        {cities.length === 0 ? (
          <p className="city-select-empty">{disabled ? "Loading cities..." : "No cities available"}</p>
        ) : (
          cities.map((city) => {
            const selected = city === value;
            return (
              <button
                key={city}
                type="button"
                className={selected ? "is-selected" : ""}
                onClick={() => {
                  onChange(city);
                  setOpen(false);
                }}
              >
                <span>
                  <strong>{city}</strong>
                  <small>{countryOf(city)}</small>
                </span>
                {selected && (
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4.5 10.5 8 14l7.5-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            );
          })
        )}
      </div>
      )}
    </div>
  );
}

function BookingForm({ loading = false }) {
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [routes, setRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState([]);
  const availableCities = [...new Set(
    allRoutes.flatMap((route) => [route.from, route.to].filter(Boolean))
  )].sort((a, b) => a.localeCompare(b));
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
      <CitySelect
        label="Select departure city"
        value={fromCity}
        cities={availableCities}
        trips={trips}
        disabled={loading || searching}
        onChange={setFromCity}
      />
      <CitySelect
        label="Select destination city"
        value={toCity}
        cities={availableCities}
        trips={trips}
        disabled={loading || searching}
        onChange={setToCity}
      />

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

      <div className="ticket-head">
        <p>{hasSearched ? "Matching tickets" : "All tickets"}</p>
        {hasSearched && (
          <button
            type="button"
            className="ticket-clear"
            onClick={() => {
              setHasSearched(false);
              setRoutes([]);
              setMessage("");
              setFromCity("");
              setToCity("");
            }}
          >
            Show all
          </button>
        )}
      </div>
      {message && <p className="booking-note">{message}</p>}
      <div className="booking-results">
        {searching ? (
          <p className="booking-note">Searching routes...</p>
        ) : (hasSearched ? routes : allRoutes).map((route) => (
          <RouteCard key={route.id} route={route} onBook={(selected) => navigate("/booking", { state: { route: selected } })} />
        ))}
      </div>
    </div>
  );
}

export default BookingForm;