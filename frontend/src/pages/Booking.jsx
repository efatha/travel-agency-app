import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { saveBooking } from "../services/bookings";

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
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  if (!route) {
    return (
      <div className="site">
        <Navbar />
        <div className="booking-page booking-page-empty">
          <p className="site-eyebrow site-eyebrow-ink">Passenger details</p>
          <h2>No route selected.</h2>
          <p>Choose a departure on the home page, then come back to name the seats.</p>
          <button className="primary-btn site-btn site-btn-gold" onClick={() => navigate("/")}>
            Back to routes
          </button>
        </div>
        <Footer variant="site" />
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

  const handleContinue = async (event) => {
    event.preventDefault();
    setSaveError("");
    setSaving(true);

    try {
      const saved = await saveBooking({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        seats: formData.seats,
        from: route.from,
        to: route.to,
        routeId: route.id,
        company: route.company,
        price: route.price,
        currency: route.currency,
        travelDate: route.date,
        departureTime: route.departureTime,
        arrivalTime: route.arrivalTime,
        duration: route.duration,
        status: "pending",
      });
      navigate("/payment", { state: { route, passenger: formData, booking: saved } });
    } catch (error) {
      console.error("Unable to save booking:", error);
      setSaveError("We could not save this booking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="site">
      <Navbar />
    <div className="booking-page">
      <p className="site-eyebrow site-eyebrow-ink">Hold the seats</p>
      <h1>Who is travelling</h1>
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

        <button className="primary-btn site-btn site-btn-gold" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Continue"}
        </button>
        {saveError && <p>{saveError}</p>}
      </form>
    </div>
      <Footer variant="site" />
    </div>
  );
}

export default Booking;