import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import BookingTable from "../components/BookingTable";
import { db } from "../firebase/firebase";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, "bookings"));
      const items = snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
      setBookings(items);
    } catch (error) {
      console.error("Unable to load bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "bookings", id), { status });
      await fetchBookings();
    } catch (error) {
      console.error("Unable to update booking:", error);
    }
  };

  return (
    <div className="page-shell">
      <h2>Bookings Management</h2>
      {loading ? <p>Loading bookings...</p> : (
        <BookingTable
          bookings={bookings}
          onConfirm={(id) => updateBookingStatus(id, "Confirmed")}
          onCancel={(id) => updateBookingStatus(id, "Cancelled")}
        />
      )}
    </div>
  );
}

export default BookingsPage;
