import SummaryCard from "./SummaryCard";

function DashboardCards({ summary = {} }) {
  return (
    <section className="dashboard-cards">
      <SummaryCard title="Total Routes" value={summary.routes ?? 0} accent="#0ea5e9" />
      <SummaryCard title="Today's Bookings" value={summary.bookings ?? 0} accent="#8b5cf6" />
      <SummaryCard title="Registered Customers" value={summary.customers ?? 0} accent="#10b981" />
      <SummaryCard title="Revenue Today" value={summary.revenue ?? "UGX 0"} accent="#f59e0b" />
    </section>
  );
}

export default DashboardCards;
