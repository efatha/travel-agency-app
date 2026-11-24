import { Link } from "react-router-dom";

function Footer({ variant = "admin" }) {
  if (variant !== "site") {
    return (
      <footer className="dashboard-footer">
        <p>East Africa Travel Admin Dashboard</p>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <p className="site-brand">Safari &amp; Coast</p>
          <p>
            Journeys across the Rift, the parks, and the spice islands — planned
            from Kampala, Nairobi, Arusha, and Stone Town.
          </p>
        </div>
        <div>
          <h3>Visit</h3>
          <a href="/#destinations">Destinations</a>
          <a href="/#journeys">Signature journeys</a>
          <a href="/#plan">Find a route</a>
        </div>
        <div>
          <h3>Travel</h3>
          <Link to="/booking">Plan a journey</Link>
          <Link to="/dashboard">Staff desk</Link>
        </div>
        <div>
          <h3>The desk</h3>
          <p>Nairobi · Arusha · Kampala</p>
          <p>hello@safariandcoast.example</p>
        </div>
      </div>
      <p className="site-footer-note">Savanna light. Ocean dusk. East Africa, unhurried.</p>
    </footer>
  );
}

export default Footer;
