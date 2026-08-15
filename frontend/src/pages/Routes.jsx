import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

function RoutesPage() {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    company: "",
    departureTime: "",
    arrivalTime: "",
    availableSeats: "",
    price: "",
    currency: "UGX",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, "routes"), {
        ...formData,
        availableSeats: Number(formData.availableSeats || 0),
        price: Number(formData.price || 0),
      });

      setMessage("Route added to Firestore successfully.");
      setFormData({
        from: "",
        to: "",
        company: "",
        departureTime: "",
        arrivalTime: "",
        availableSeats: "",
        price: "",
        currency: "UGX",
      });
    } catch (error) {
      console.error("Unable to add route:", error);
      setMessage("Unable to add route right now.");
    }
  };

  return (
    <div className="page-shell">
      <h2>Route Management</h2>
      <div className="panel">
        <div className="panel-header">
          <h3>Add Route</h3>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>From <input name="from" value={formData.from} onChange={handleChange} placeholder="Kampala" required /></label>
          <label>To <input name="to" value={formData.to} onChange={handleChange} placeholder="Kigali" required /></label>
          <label>Company <input name="company" value={formData.company} onChange={handleChange} placeholder="East Africa Express" required /></label>
          <label>Departure <input name="departureTime" value={formData.departureTime} onChange={handleChange} placeholder="8:00 AM" required /></label>
          <label>Arrival <input name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} placeholder="5:00 PM" required /></label>
          <label>Seats <input name="availableSeats" type="number" value={formData.availableSeats} onChange={handleChange} placeholder="40" required /></label>
          <label>Price <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="80000" required /></label>
          <button className="primary-btn" type="submit">Add Route</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default RoutesPage;
