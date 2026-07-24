import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const route = state?.route;
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    seats: "1",
  });

  if (!route) {
    return (
      <div className="booking-page booking-page-empty">
        <h2>No route selected.</h2>
        <button className="primary-btn" onClick={() => navigate("/")}>
          Back to routes
        </button>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleContinue = (event) => {
    event.preventDefault();
    navigate("/payment", { state: { route, passenger: formData } });
  };

  return (
    <div className="booking-page">
      <div className="trip-summary">
        <div className="summary-row">
          <span>Route</span>
          <strong>
            {route.from} → {route.to}
          </strong>
        </div>

        <div className="summary-row">
          <span>Company</span>
          <strong>{route.company || "N/A"}</strong>
        </div>

        <div className="summary-row">
          <span>Departure</span>
          <strong>{route.departureTime || "N/A"}</strong>
        </div>

        <div className="summary-row">
          <span>Arrival</span>
          <strong>{route.arrivalTime || "N/A"}</strong>
        </div>

        <div className="summary-row">
          <span>Duration</span>
          <strong>{route.duration || "N/A"}</strong>
        </div>

        <div className="summary-row">
          <span>Price</span>
          <strong>
            {route.price ? `${route.currency || ""} ${route.price}`.trim() : "N/A"}
          </strong>
        </div>
      </div>

      <form className="booking-form" onSubmit={handleContinue}>
        <h3>Passenger Information</h3>

        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </label>

        <label>
          Email (optional)
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
        </label>

        <label>
          Seats
          <select name="seats" value={formData.seats} onChange={handleChange}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>

        <button className="primary-btn" type="submit">
          Continue
        </button>
      </form>
    </div>
  );
}

export default Booking;