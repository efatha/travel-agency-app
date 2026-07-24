import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const route = state?.route;
  const passenger = state?.passenger;

  return (
    <div className="booking-page booking-page-empty">
      <h2>Payment</h2>
      <p style={{ margin: "16px 0" }}>
        Ready to pay for {route?.from || "your selected trip"} → {route?.to || "destination"}.
      </p>
      <p>
        Passenger: {passenger?.fullName || "N/A"}
      </p>
      <button className="primary-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
}

export default Payment;