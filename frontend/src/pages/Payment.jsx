import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";

const RECEIVING_ACCOUNT = "Agency Receiving Account: keep this in an admin-only Firestore document or secure environment variable.";
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/test_bJe4gy6mogE4bEY7O297G00";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const route = state?.route;
  const passenger = state?.passenger;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Stripe Card Payment");
  const [transactionRef, setTransactionRef] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [receipt, setReceipt] = useState(null);

  const amount = useMemo(() => {
    if (!route?.price) return "N/A";
    return `${route.currency || ""} ${route.price}`.trim();
  }, [route]);

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
        bookingId: `EA${Date.now().toString().slice(-6)}`,
        customerName: passenger.fullName,
        phoneNumber: passenger.phoneNumber || "N/A",
        route: `${route.from} → ${route.to}`,
        company: route.company || "N/A",
        amount,
        paymentMethod: "Stripe Card Payment",
        transactionRef: "Stripe checkout initiated",
        status: "Pending Stripe confirmation",
        receivingAccount: RECEIVING_ACCOUNT,
        paidAt: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "payments"), {
        bookingId: generatedReceipt.bookingId,
        customerName: generatedReceipt.customerName,
        phoneNumber: generatedReceipt.phoneNumber,
        route: generatedReceipt.route,
        company: generatedReceipt.company,
        amount: generatedReceipt.amount,
        method: generatedReceipt.paymentMethod,
        transactionId: generatedReceipt.transactionRef,
        status: generatedReceipt.status,
        paidAt: new Date().toISOString(),
      });

      setStatusMessage("Redirecting you to the secure Stripe checkout page...");
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

    if (!isStripePayment && !transactionRef.trim()) {
      setStatusMessage("Please complete the transaction details before paying.");
      return;
    }

    if (isStripePayment) {
      await handleStripeCheckout();
      return;
    }

    try {
      const generatedReceipt = {
        bookingId: `EA${Date.now().toString().slice(-6)}`,
        customerName: passenger.fullName,
        phoneNumber: passenger.phoneNumber || "N/A",
        route: `${route.from} → ${route.to}`,
        company: route.company || "N/A",
        amount,
        paymentMethod,
        transactionRef,
        status: "Paid",
        receivingAccount: RECEIVING_ACCOUNT,
        paidAt: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "payments"), {
        bookingId: generatedReceipt.bookingId,
        customerName: generatedReceipt.customerName,
        phoneNumber: generatedReceipt.phoneNumber,
        route: generatedReceipt.route,
        company: generatedReceipt.company,
        amount: generatedReceipt.amount,
        method: generatedReceipt.paymentMethod,
        transactionId: generatedReceipt.transactionRef,
        status: "Paid",
        paidAt: new Date().toISOString(),
      });

      setReceipt(generatedReceipt);
      setStatusMessage("Payment successful. Your receipt is ready below.");
    } catch (error) {
      console.error("Unable to save payment:", error);
      setStatusMessage("Payment could not be completed right now. Please try again.");
    }
  };

  if (!route) {
    return (
      <main className="page-shell">
        <h1>Payments</h1>
        <p className="helper-text">Review payment records and recent transaction activity.</p>

        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length > 0 ? (
          payments.map((payment) => (
            <section key={payment.id} className="panel payment-card" aria-label="Payment record">
              <p><strong>Booking:</strong> {payment.bookingId || payment.booking || "N/A"}</p>
              <p><strong>Amount:</strong> {payment.amount || payment.price || "N/A"}</p>
              <p><strong>Method:</strong> {payment.method || payment.paymentMethod || "N/A"}</p>
              <p><strong>Status:</strong> {payment.status || "Pending"}</p>
              <p><strong>Transaction:</strong> {payment.transactionId || payment.transaction || "N/A"}</p>
            </section>
          ))
        ) : (
          <section className="panel">
            <p>No payments found in Firestore yet.</p>
          </section>
        )}

        <button className="primary-btn" type="button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="booking-page" aria-labelledby="payment-heading">
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
            <>
              <p className="helper-text">
                Secure checkout is connected to the Stripe test payment link for this trip. A new tab will open with the booking details attached to the payment link.
              </p>
              <p className="helper-text">
                Route: {route.from} → {route.to} · Amount: {amount} · Company: {route.company || "N/A"}
              </p>
            </>
          ) : (
            <>
              <label htmlFor="transactionRef">Transaction Reference</label>
              <input
                id="transactionRef"
                type="text"
                placeholder="Enter transaction reference"
                value={transactionRef}
                onChange={(event) => setTransactionRef(event.target.value)}
                aria-describedby="transactionHint"
                required
              />
              <p id="transactionHint" className="helper-text">Enter the reference code shown on your mobile money or card confirmation.</p>
            </>
          )}

          <p className="helper-text">Confidential receiving account details are kept in the admin-only payment setup and are not shown publicly.</p>

          <button className="primary-btn" type="submit">
            {isStripePayment ? "Pay with Stripe" : "Pay Now"}
          </button>

          {statusMessage && <p>{statusMessage}</p>}
        </form>
      ) : (
        <section className="panel" aria-label="Payment receipt">
          <h2>Payment Receipt</h2>
          <p><strong>Booking ID:</strong> {receipt.bookingId}</p>
          <p><strong>Customer:</strong> {receipt.customerName}</p>
          <p><strong>Phone:</strong> {receipt.phoneNumber}</p>
          <p><strong>Route:</strong> {receipt.route}</p>
          <p><strong>Company:</strong> {receipt.company}</p>
          <p><strong>Amount:</strong> {receipt.amount}</p>
          <p><strong>Method:</strong> {receipt.paymentMethod}</p>
          <p><strong>Transaction:</strong> {receipt.transactionRef}</p>
          <p><strong>Paid At:</strong> {receipt.paidAt}</p>
          <p><strong>Receiving Account:</strong> {receipt.receivingAccount}</p>

          <button className="primary-btn" type="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </section>
      )}
    </main>
  );
}

export default Payment;