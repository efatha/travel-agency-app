import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export async function saveBooking(payload) {
  const from = payload.from || "";
  const to = payload.to || "";
  const route =
    payload.route || (from && to ? `${from} → ${to}` : "");

  const record = {
    fullName: payload.fullName || "",
    customer: payload.customer || payload.fullName || "",
    phoneNumber: payload.phoneNumber || "",
    phone: payload.phone || payload.phoneNumber || "",
    email: payload.email || "",
    seats: payload.seats || "1",
    from,
    to,
    route,
    company: payload.company || "",
    price: payload.price ?? null,
    currency: payload.currency || "USD",
    status: payload.status || "pending",
    payment: payload.payment || "Pending",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "bookings"), record);
  return docRef.id;
}
