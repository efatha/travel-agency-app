function BookingTable({ bookings = [] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Bookings Management</h3>
      </div>

      <div className="table-wrap">
        <table className="data-table table-wide">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Route</th>
              <th>Company</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <tr key={booking.id || `${booking.bookingId || "booking"}-${index}`}>
                  <td>{booking.bookingRef || booking.bookingId || booking.id}</td>
                  <td>{booking.customer || booking.fullName || "Unknown"}</td>
                  <td>{booking.phone || booking.phoneNumber || "N/A"}</td>
                  <td>{booking.route || "N/A"}</td>
                  <td>{booking.company || "N/A"}</td>
                  <td>{booking.status || "pending"}</td>
                  <td>{booking.payment || "Unpaid"}{booking.transactionRef ? ` · ${booking.transactionRef}` : ""}</td>
                  <td>
                    <div className="action-group">
                      <button className="small-btn">View</button>
                      <button className="small-btn">Edit</button>
                      <button className="small-btn danger">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default BookingTable;
