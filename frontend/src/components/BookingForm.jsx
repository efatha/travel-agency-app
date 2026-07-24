import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function BookingForm({ cities = [], loading = false }) {
  const availableCities = cities;
  const navigate = useNavigate();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [routes, setRoutes] = useState([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");

  const normalizeValue = (value) =>
    typeof value === "string" ? value.trim().toLowerCase() : "";

  const searchRoutes = async () => {
    if (!fromCity || !toCity) {
      setRoutes([]);
      setMessage("Please select both departure and destination cities.");
      return;
    }

    setSearching(true);
    setMessage("");
    setRoutes([]);

    try {
      const snapshot = await getDocs(collection(db, "routes"));
      const results = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((route) => {
          return (
            normalizeValue(route.from) === normalizeValue(fromCity) &&
            normalizeValue(route.to) === normalizeValue(toCity)
          );
        });

      setRoutes(results);

      if (results.length === 0) {
        setMessage(`No route found from ${fromCity} to ${toCity}.`);
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
      <h2>Find Your Trip</h2>

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

      <div style={{ marginTop: "1rem" }}>
        {searching ? (
          <p>Searching routes...</p>
        ) : routes.length > 0 ? (
          routes.map((route) => (
            <div key={route.id} className="route-card">
              <h3>
                {route.from} → {route.to}
              </h3>
              <p><strong>Company:</strong> {route.company || "N/A"}</p>
              <p><strong>Date:</strong> {route.date || "N/A"}</p>
              <p><strong>Departure:</strong> {route.departureTime || "N/A"}</p>
              <p><strong>Arrival:</strong> {route.arrivalTime || "N/A"}</p>
              <p><strong>Duration:</strong> {route.duration || "N/A"}</p>
              <p><strong>Available Seats:</strong> {route.availableSeats ?? "N/A"}</p>
              <p><strong>Price:</strong> {route.price ? `${route.currency || ""} ${route.price}`.trim() : "N/A"}</p>
              <button
                className="primary-btn"
                onClick={() => navigate("/booking", { state: { route } })}
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          message && <p>{message}</p>
        )}
      </div>
    </div>
  );
}

export default BookingForm;