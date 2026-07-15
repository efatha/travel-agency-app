function BookingForm({ cities = [], loading = false }) {
  const availableCities = cities;

  return (
    <div className="booking">
      <h2>Find Your Trip</h2>
      <select disabled={loading}>
  {loading ? (
    <option>Loading cities...</option>
  ) : availableCities.length === 0 ? (
    <option>No cities available</option>
  ) : (
    availableCities.map((city) => (
      <option key={city} value={city}>
        {city}
      </option>
    ))
  )}
     </select>
      <select disabled={loading}>
  {loading ? (
    <option>Loading cities...</option>
  ) : availableCities.length === 0 ? (
    <option>No cities available</option>
  ) : (
    availableCities.map((city) => (
      <option key={`${city}-return`} value={city}>
        {city}
      </option>
    ))
  )}
</select>
      <select>
        <option>Tuesday 5 PM</option>
        <option>Thursday 5 PM</option>
        <option>Saturday 5 PM</option>
      </select>
      <button>{loading ? "Loading..." : "Search"}</button>
    </div>
  );
}

export default BookingForm;