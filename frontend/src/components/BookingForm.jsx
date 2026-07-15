function BookingForm({ cities = [], loading = false }) {
  const availableCities = cities.length > 0 ? cities : ["Dar es Salaam", "Kampala","Nairobi"];

  return (
    <div className="booking">
      <h2>Find Your Trip</h2>
      <select>
        {availableCities.map((city) => (
          <option key={city}>{city}</option>
        ))}
      </select>
      <select>
        {availableCities.map((city) => (
          <option key={`${city}-return`}>{city}</option>
        ))}
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