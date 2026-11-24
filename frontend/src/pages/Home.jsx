import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Destinations from "../components/Destinations";
import Journeys from "../components/Journeys";
import WhyStrip from "../components/WhyStrip";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";
import { loadBookingCities } from "../services/trips";

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loadBookingCities()
      .then((cities) => {
        if (active && cities.length) setTrips(cities);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="site">
      <Navbar />
      <Hero />
      <Destinations />
      <Journeys />
      <WhyStrip />
      <section className="plan-band" id="plan">
        <div className="site-section-head">
          <p className="site-eyebrow site-eyebrow-ink">Live routes</p>
          <h2>Find a departure</h2>
          <p>Choose two cities. We look up the coaches and safari transfers on file.</p>
        </div>
        <BookingForm cities={trips} loading={loading} />
      </section>
      <Footer variant="site" />
    </div>
  );
}

export default Home;
