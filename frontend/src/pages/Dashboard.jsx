import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import RecentBookings from "../components/RecentBookings";
import PopularRoutes from "../components/PopularRoutes";
import Footer from "../components/Footer";
import { db } from "../firebase/firebase";

function formatRevenue(value) {
  return new Intl.NumberFormat("en-UG", {
    style: "currency",
    currency: "UGX",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function Dashboard() {
  const [summary, setSummary] = useState({ routes: 0, bookings: 0, customers: 0, revenue: "UGX 0" });
  const [recentBookings, setRecentBookings] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [routeSnapshot, bookingSnapshot, customerSnapshot, paymentSnapshot] = await Promise.all([
          getDocs(collection(db, "routes")),
          getDocs(collection(db, "bookings")),
          getDocs(collection(db, "customers")),
          getDocs(collection(db, "payments")),
        ]);

        const routes = routeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const bookings = bookingSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const customers = customerSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const payments = paymentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const routeFrequency = routes.reduce((accumulator, route) => {
          const key = `${route.from || "Unknown"} → ${route.to || "Unknown"}`;
          accumulator[key] = (accumulator[key] || 0) + 1;
          return accumulator;
        }, {});

        const revenue = payments.reduce((total, payment) => {
          const numeric = Number(String(payment.amount || payment.price || 0).replace(/[^0-9.-]+/g, ""));
          return total + (Number.isFinite(numeric) ? numeric : 0);
        }, 0);

        const mappedBookings = bookings.map((booking) => ({
          id: booking.id,
          customer: booking.customer || booking.fullName || "Unknown",
          route: booking.route || `${booking.from || "Unknown"} → ${booking.to || "Unknown"}`,
          status: booking.status || "Pending",
          payment: booking.paymentStatus || booking.payment || "Pending",
        }));

        setSummary({
          routes: routes.length,
          bookings: bookings.length,
          customers: customers.length,
          revenue: formatRevenue(revenue),
        });

        setRecentBookings(mappedBookings.slice(0, 4));
        setPopularRoutes(
          Object.entries(routeFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([label, count]) => ({ label, count }))
        );
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h1>East Africa Travel</h1>
            <p>Admin Dashboard</p>
          </div>
        </header>

        {loading ? <p>Loading dashboard data...</p> : (
          <>
            <DashboardCards summary={summary} />
            <RecentBookings bookings={recentBookings} />
            <PopularRoutes routes={popularRoutes} />
          </>
        )}

        <Footer />
      </main>
    </div>
  );
}

export default Dashboard;