import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const goTo = (event, id) => {
    event.preventDefault();
    close();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }
    window.location.assign(`/#${id}`);
  };

  return (
    <header className="site-nav">
      <Link to="/" className="site-brand" onClick={close}>
        <span className="site-brand-mark" aria-hidden="true" />
        Safari &amp; Coast
      </Link>

      <button
        type="button"
        className="site-menu-btn"
        aria-expanded={open}
        aria-controls="site-nav-links"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close" : "Menu"}
      </button>

      <nav id="site-nav-links" className={open ? "site-links is-open" : "site-links"}>
        <Link to="/" onClick={close}>
          Home
        </Link>
        <a href="/#destinations" onClick={(event) => goTo(event, "destinations")}>
          Destinations
        </a>
        <a href="/#journeys" onClick={(event) => goTo(event, "journeys")}>
          Journeys
        </a>
        <a href="/#plan" onClick={(event) => goTo(event, "plan")}>
          Book
        </a>
        <Link to="/dashboard" className="site-admin-link" onClick={close}>
          Dashboard
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
