import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const snapshot = await getDocs(collection(db, "customers"));
        setCustomers(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      } catch (error) {
        console.error("Unable to load customers:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  return (
    <div className="page-shell">
      <h2>Customer Management</h2>
      {loading ? <p>Loading customers...</p> : (
        customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer.id} className="panel customer-card">
              <h3>{customer.fullName || customer.name || "Unknown customer"}</h3>
              <p><strong>Phone:</strong> {customer.phone || "N/A"}</p>
              <p><strong>Email:</strong> {customer.email || "N/A"}</p>
              <p><strong>Bookings:</strong> {customer.bookings ?? customer.bookingCount ?? 0}</p>
              <p><strong>Status:</strong> {customer.status || "Active"}</p>
            </div>
          ))
        ) : (
          <div className="panel"><p>No customers found in Firestore yet.</p></div>
        )
      )}
    </div>
  );
}

export default CustomersPage;
