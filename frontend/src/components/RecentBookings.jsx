function RecentBookings({ bookings = [] }) {
  const recent = bookings.slice(0, 4);

  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Recent Bookings</h3>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Route</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {recent.length > 0 ? (
              recent.map((booking) => (
                <tr key={booking.id || booking.bookingId || booking.customer}>
                  <td>{booking.customer || booking.fullName || "Unknown"}</td>
                  <td>{booking.route || "Unknown route"}</td>
                  <td>{booking.status || "Pending"}</td>
                  <td>{booking.payment || "Pending"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No bookings available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentBookings;
