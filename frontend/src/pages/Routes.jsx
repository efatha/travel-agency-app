import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getJourneys } from "../services/trips";
import Sidebar from "../components/Sidebar";

const emptyRoute = {
  from: "",
  to: "",
  company: "",
  date: "",
  departureTime: "",
  arrivalTime: "",
  duration: "",
  availableSeats: "",
  price: "",
  currency: "UGX",
};

function RoutesPage() {
  const [formData, setFormData] = useState(emptyRoute);
  const [editingId, setEditingId] = useState("");
  const [showRoutePicker, setShowRoutePicker] = useState(false);
  const [message, setMessage] = useState("");
  const [storedRoutes, setStoredRoutes] = useState(null);

  useEffect(() => {
    async function loadRoutes() {
      try {
        const snapshot = await getDocs(collection(db, "routes"));
        setStoredRoutes(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      } catch (error) {
        console.error("Unable to load routes:", error);
        setStoredRoutes([]);
      }
    }

    loadRoutes();
  }, []);

  const signatureJourneys = storedRoutes && storedRoutes.length === 0 ? getJourneys() : [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      availableSeats: Number(formData.availableSeats || 0),
      price: Number(formData.price || 0),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "routes", editingId), payload);
        setStoredRoutes((current) =>
          (current || []).map((route) => (route.id === editingId ? { ...route, ...payload } : route))
        );
        setMessage("Route updated.");
      } else {
        const created = await addDoc(collection(db, "routes"), payload);
        setStoredRoutes((current) => [...(current || []), { ...payload, id: created.id }]);
        setMessage("Route added to Firestore successfully.");
      }

      setEditingId("");
      setShowRoutePicker(false);
      setFormData(emptyRoute);
    } catch (error) {
      console.error("Unable to save route:", error);
      setMessage(editingId ? "Unable to update this route." : "Unable to add route right now.");
    }
  };

  const startEdit = (route) => {
    setEditingId(route.id);
    setFormData({
      from: route.from || "",
      to: route.to || "",
      company: route.company || "",
      date: route.date || "",
      departureTime: route.departureTime || "",
      arrivalTime: route.arrivalTime || "",
      duration: route.duration || "",
      availableSeats: route.availableSeats ?? "",
      price: route.price ?? "",
      currency: route.currency || "UGX",
    });
    setMessage("");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main page-shell">
      <h2>Route Management</h2>
      <div className="panel">
        <div className="panel-header">
          <h3>Add Route</h3>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>From <input name="from" value={formData.from} onChange={handleChange} placeholder="Kampala" required /></label>
          <label>To <input name="to" value={formData.to} onChange={handleChange} placeholder="Nairobi" required /></label>
          <label>Company <input name="company" value={formData.company} onChange={handleChange} placeholder="East Africa Express" required /></label>
          <label>Date <input name="date" value={formData.date} onChange={handleChange} placeholder="15-07-2026" required /></label>
          <label>Departure <input name="departureTime" value={formData.departureTime} onChange={handleChange} placeholder="8:00 AM" required /></label>
          <label>Arrival <input name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} placeholder="5:00 PM" required /></label>
          <label>Duration <input name="duration" value={formData.duration} onChange={handleChange} placeholder="16 Hours" /></label>
          <label>Currency <input name="currency" value={formData.currency} onChange={handleChange} placeholder="UGX" required /></label>
          <label>Seats <input name="availableSeats" type="number" value={formData.availableSeats} onChange={handleChange} placeholder="40" required /></label>
          <label>Price <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="80000" required /></label>
          {showRoutePicker && (
            <label>
              Choose a route
              <select
                value={editingId}
                onChange={(event) => {
                  const route = (storedRoutes || []).find((item) => item.id === event.target.value);
                  if (route) startEdit(route);
                }}
              >
                <option value="">Select an existing route</option>
                {(storedRoutes || []).map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.from} → {route.to} · {route.company} · {route.date}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="action-group">
            <button className="primary-btn" type="submit">{editingId ? "Save changes" : "Add Route"}</button>
            <button
              className="primary-btn"
              type="button"
              onClick={() => {
                setShowRoutePicker(true);
                setMessage("");
              }}
            >
              Edit
            </button>
          </div>
          {message && <p>{message}</p>}
        </form>
        {storedRoutes && storedRoutes.length > 0 && (
          <div>
            <h3>Routes in Firestore</h3>
            {storedRoutes.map((route) => (
              <p key={route.id}>
                {route.from} → {route.to} · {route.company} · {route.date} · {route.departureTime}–{route.arrivalTime} · {route.currency} {route.price} · seats {route.availableSeats}
              </p>
            ))}
          </div>
        )}
        {signatureJourneys.length > 0 && (
          <div>
            <h3>Signature journeys</h3>
            {signatureJourneys.map((journey) => (
              <p key={journey.id}>
                {journey.title}: {journey.from} → {journey.to} · {journey.days} days · from USD {journey.priceFrom}
              </p>
            ))}
          </div>
        )}
      </div>
      </main>
    </div>
  );
}

export default RoutesPage;
