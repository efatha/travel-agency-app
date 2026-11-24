import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { recordPhysicalPayment } from "../services/bookings";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_bJe4gy6mogE4bEY7O297G00";
const PHYSICAL_METHODS = ["Cash", "MTN Mobile Money", "Airtel Money"];

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const route = state?.route;
  const passenger = state?.passenger;
  const booking = state?.booking;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactionRef, setTransactionRef] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [paymentDate, setPaymentDate] = useState("");

  const seats = Number(booking?.seats || passenger?.seats || 1);
  const unitPrice = Number(route?.price || 0);
  const amountDue = booking?.amountDue ?? unitPrice * seats;
  const amount = useMemo(() => {
    if (!route?.price && amountDue == null) return "N/A";
    return `${route?.currency || booking?.currency || ""} ${amountDue}`.trim();
  }, [route, booking, amountDue]);

  useEffect(() => {
    if (route) {
      return;
    }

    async function fetchPayments() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "payments"));
        setPayments(snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() })));
      } catch (error) {
        console.error("Unable to load payments:", error);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, [route]);

  const isStripePayment = paymentMethod === "Stripe Card Payment";

  const getStripeCheckoutUrl = () => {
    if (!route || !passenger) {
      return STRIPE_PAYMENT_LINK;
    }

    const url = new URL(STRIPE_PAYMENT_LINK);

    if (passenger.email) {
      url.searchParams.set("prefilled_email", passenger.email);
    }

    const customerLabel = encodeURIComponent(passenger.fullName || "traveller");
    url.searchParams.set("client_reference_id", `${customerLabel}-${Date.now()}`);
    url.searchParams.set(
      "description",
      `${route.from} → ${route.to} • ${route.company || "Travel booking"}`
    );

    return url.toString();
  };

  const handleStripeCheckout = async () => {
    if (!route || !passenger?.fullName) {
      setStatusMessage("Please complete the customer details before starting Stripe checkout.");
      return;
    }

    try {
      const generatedReceipt = {
        bookingId: booking?.bookingRef || booking?.id || "Unlinked",
        customerName: passenger.fullName,
        phoneNumber: passenger.phoneNumber || "N/A",
        route: `${route.from} → ${route.to}`,
        company: route.company || "N/A",
        amount,
        paymentMethod: "Stripe Card Payment",
        transactionRef: "Stripe checkout initiated",
        status: "Pending Stripe confirmation",
        paidAt: new Date().toLocaleString(),
      };

      setStatusMessage("Redirecting you to the Stripe test page. This does not record the fare as received.");
      window.open(getStripeCheckoutUrl(), "_blank", "noopener,noreferrer");
      setReceipt(generatedReceipt);
    } catch (error) {
      console.error("Unable to start Stripe checkout:", error);
      setStatusMessage("Stripe checkout could not be started right now. Please try again.");
    }
  };

  const handlePayNow = async (event) => {
    event.preventDefault();

    if (!route || !passenger?.fullName) {
      setStatusMessage("Please complete the customer details before paying.");
      return;
    }

    const isPhysical = PHYSICAL_METHODS.includes(paymentMethod);
    if (isPhysical && (!transactionRef.trim() || !receivedBy.trim() || !amountReceived)) {
      setStatusMessage("Enter the amount received, the receipt reference, and who received the money.");
      return;
    }

    if (isStripePayment) {
      await handleStripeCheckout();
      return;
    }

    try {
      const paymentId = await recordPhysicalPayment({
        bookingId: booking?.id,
        bookingRef: booking?.bookingRef,
        customerName: passenger.fullName,
        phoneNumber: passenger.phoneNumber,
        route: `${route.from} → ${route.to}`,
        routeId: route.id,
        company: route.company,
        seats,
        currency: route.currency || booking?.currency,
        amountDue,
        amountReceived,
        method: paymentMethod,
        transactionRef,
        receivedBy,
      });

      setReceipt({
        bookingId: booking?.bookingRef || booking?.id || "Unlinked",
        paymentId,
        customerName: passenger.fullName,
        phoneNumber: passenger.phoneNumber || "N/A",
        route: `${route.from} → ${route.to}`,
        company: route.company || "N/A",
        amount: `${route.currency || ""} ${amountReceived}`.trim(),
        amountDue: amount,
        paymentMethod,
        transactionRef,
        receivedBy,
        status: "Recorded",
        paidAt: new Date().toLocaleString(),
      });
      setStatusMessage("Physical payment recorded and linked to this booking.");
    } catch (error) {
      console.error("Unable to save payment:", error);
      setStatusMessage("Payment could not be completed right now. Please try again.");
    }
  };

  const paymentDay = (payment) => {
    const raw = payment.paidAt;
    const date = raw?.toDate
      ? raw.toDate()
      : raw?.seconds
        ? new Date(raw.seconds * 1000)
        : raw
          ? new Date(raw)
          : null;
    if (!date || Number.isNaN(date.getTime())) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  };

  const visiblePayments = paymentDate
    ? payments.filter((payment) => paymentDay(payment) === paymentDate)
    : payments;

  if (!route) {
    return (
      <main className="page-shell">
        <h1>Payments</h1>
        <p className="helper-text">Search recorded payments by the day they were taken.</p>
        <label className="payment-date-search">
          Date
          <input
            type="date"
            value={paymentDate}
            onChange={(event) => setPaymentDate(event.target.value)}
          />
          {paymentDate && (
            <button type="button" onClick={() => setPaymentDate("")}>Clear</button>
          )}
        </label>

        {loading ? (
          <p>Loading payments...</p>
        ) : visiblePayments.length > 0 ? (
          <div className={visiblePayments.length > 1 ? "payment-grid" : "payment-list"}>
            {visiblePayments.map((payment) => (
              <section key={payment.id} className="panel payment-card" aria-label="Payment record">
                <p><strong>Booking:</strong> {payment.bookingRef || payment.bookingId || "N/A"}</p>
                <p><strong>Date:</strong> {paymentDay(payment) || "N/A"}</p>
                <p><strong>Amount:</strong> {payment.amountReceived ?? payment.amount ?? payment.price ?? "N/A"} {payment.currency || ""}</p>
                <p><strong>Method:</strong> {payment.method || payment.paymentMethod || "N/A"}</p>
                <p><strong>Status:</strong> {payment.status || "Pending"}</p>
                <p><strong>Receipt:</strong> {payment.transactionRef || payment.transactionId || "N/A"}</p>
                <p><strong>Received by:</strong> {payment.receivedBy || "N/A"}</p>
              </section>
            ))}
          </div>
        ) : (
          <section className="panel">
            <p>{paymentDate ? "No payments recorded on that date." : "No payments found in Firestore yet."}</p>
          </section>
        )}

        <button className="primary-btn" type="button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <div className="site">
      <Navbar />
    <main className="booking-page" aria-labelledby="payment-heading">
      <p className="site-eyebrow site-eyebrow-ink">Settle the journey</p>
      <h1 id="payment-heading">Payment</h1>
      <p className="helper-text">
        Complete your payment securely for {route.from} → {route.to}.
      </p>

      <section className="trip-summary" aria-label="Trip summary">
        <div className="summary-row">
          <span>Route</span>
          <strong>{route.from} → {route.to}</strong>
        </div>
        <div className="summary-row">
          <span>Company</span>
          <strong>{route.company || "N/A"}</strong>
        </div>
        <div className="summary-row">
          <span>Amount</span>
          <strong>{amount}</strong>
        </div>
      </section>

      {!receipt ? (
        <form className="booking-form" aria-label="Payment details form" onSubmit={handlePayNow}>
          <label htmlFor="paymentMethod">Payment Method</label>
          <select id="paymentMethod" name="paymentMethod" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
            <option>Stripe Card Payment</option>
            <option>MTN Mobile Money</option>
            <option>Airtel Money</option>
            <option>Card</option>
            <option>Cash</option>
          </select>

          <label htmlFor="customerName">Customer Name</label>
          <input id="customerName" type="text" value={passenger?.fullName || ""} readOnly />

          {isStripePayment ? (
            <p className="helper-text">
              Stripe test checkout does not record this fare as received. Use Cash, MTN, or Airtel to save a physical payment against booking {booking?.bookingRef || "this trip"}.
            </p>
          ) : (
            <>
              <label htmlFor="amountReceived">Amount received</label>
              <input
                id="amountReceived"
                type="number"
                min="0"
                placeholder={String(amountDue || "")}
                value={amountReceived}
                onChange={(event) => setAmountReceived(event.target.value)}
                required
              />
              <label htmlFor="transactionRef">Receipt reference</label>
              <input
                id="transactionRef"
                type="text"
                placeholder="Cash receipt or mobile-money message code"
                value={transactionRef}
                onChange={(event) => setTransactionRef(event.target.value)}
                required
              />
              <label htmlFor="receivedBy">Received by</label>
              <input
                id="receivedBy"
                type="text"
                placeholder="Staff name"
                value={receivedBy}
                onChange={(event) => setReceivedBy(event.target.value)}
                required
              />
              <p className="helper-text">
                Booking {booking?.bookingRef || "not linked"} · {seats} seat{seats > 1 ? "s" : ""} · due {amount}. This saves the cash or handset payment already taken. It does not move money.
              </p>
            </>
          )}

          <button className="primary-btn site-btn site-btn-gold" type="submit">
            {isStripePayment ? "Open Stripe test" : "Record payment"}
          </button>

          {statusMessage && <p>{statusMessage}</p>}
        </form>
      ) : (
        <section className="panel" aria-label="Payment receipt">
          <h2>Payment Receipt</h2>
          <p><strong>Booking:</strong> {receipt.bookingId}</p>
          <p><strong>Payment record:</strong> {receipt.paymentId || "Not stored"}</p>
          <p><strong>Customer:</strong> {receipt.customerName}</p>
          <p><strong>Phone:</strong> {receipt.phoneNumber}</p>
          <p><strong>Route:</strong> {receipt.route}</p>
          <p><strong>Company:</strong> {receipt.company}</p>
          <p><strong>Due:</strong> {receipt.amountDue || receipt.amount}</p>
          <p><strong>Received:</strong> {receipt.amount}</p>
          <p><strong>Method:</strong> {receipt.paymentMethod}</p>
          <p><strong>Receipt:</strong> {receipt.transactionRef}</p>
          <p><strong>Received by:</strong> {receipt.receivedBy || "N/A"}</p>
          <p><strong>Status:</strong> {receipt.status}</p>
          <p><strong>Recorded at:</strong> {receipt.paidAt}</p>

          <button className="primary-btn site-btn site-btn-gold" type="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </section>
      )}
    </main>
      <Footer variant="site" />
    </div>
  );
}

export default Payment;