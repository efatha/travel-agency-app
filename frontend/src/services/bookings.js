import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function bookingRef() {
  const stamp = Date.now().toString(36).toUpperCase();
  const noise = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EA-${stamp}-${noise}`;
}

export async function saveBooking(payload) {
  const from = payload.from || "";
  const to = payload.to || "";
  const route = payload.route || (from && to ? `${from} → ${to}` : "");
  const seats = Number(payload.seats || 1);
  const unitPrice = payload.price == null || payload.price === "" ? null : Number(payload.price);
  const amountDue = unitPrice == null || Number.isNaN(unitPrice) ? null : unitPrice * seats;
  const reference = payload.bookingRef || bookingRef();

  const record = {
    bookingRef: reference,
    fullName: payload.fullName || "",
    customer: payload.customer || payload.fullName || "",
    phoneNumber: payload.phoneNumber || "",
    phone: payload.phone || payload.phoneNumber || "",
    email: payload.email || "",
    seats,
    from,
    to,
    route,
    routeId: payload.routeId || "",
    company: payload.company || "",
    travelDate: payload.travelDate || "",
    departureTime: payload.departureTime || "",
    arrivalTime: payload.arrivalTime || "",
    duration: payload.duration || "",
    unitPrice,
    price: unitPrice,
    amountDue,
    currency: payload.currency || "",
    status: payload.status || "pending",
    payment: "Unpaid",
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "bookings"), record);
  return { id: docRef.id, bookingRef: reference, amountDue, currency: record.currency, seats };
}

export async function recordPhysicalPayment(payload) {
  const amountReceived = Number(payload.amountReceived);
  const paymentRecord = {
    bookingId: payload.bookingId,
    bookingRef: payload.bookingRef || "",
    customerName: payload.customerName || "",
    phoneNumber: payload.phoneNumber || "",
    route: payload.route || "",
    routeId: payload.routeId || "",
    company: payload.company || "",
    seats: Number(payload.seats || 1),
    currency: payload.currency || "",
    amountDue: payload.amountDue ?? null,
    amountReceived,
    method: payload.method,
    channel: "physical",
    transactionRef: payload.transactionRef || "",
    receivedBy: payload.receivedBy || "",
    note: payload.note || "",
    status: "Recorded",
    paidAt: serverTimestamp(),
  };

  const paymentRef = await addDoc(collection(db, "payments"), paymentRecord);

  if (payload.bookingId) {
    await updateDoc(doc(db, "bookings", payload.bookingId), {
      payment: "Recorded",
      paymentId: paymentRef.id,
      paymentMethod: payload.method,
      amountReceived,
      transactionRef: payload.transactionRef || "",
      receivedBy: payload.receivedBy || "",
      paidAt: serverTimestamp(),
    });
  }

  return paymentRef.id;
}
