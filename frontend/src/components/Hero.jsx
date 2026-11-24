const HERO_IMAGE =
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2000&q=80";

function Hero() {
  return (
    <section
      className="site-hero"
      style={{ backgroundImage: `url(${HERO_IMAGE})` }}
    >
      <div className="site-hero-shade" />
      <div className="site-hero-copy">
        <p className="site-eyebrow">Uganda · Kenya · Tanzania · the spice coast</p>
        <h1>Dusk over the Rift. Dawn on the savanna.</h1>
        <p className="site-hero-lead">
          Safaris, crater highlands, and Indian Ocean nights — planned with the
          patience of people who live beside the migration.
        </p>
        <div className="site-hero-actions">
          <a className="site-btn site-btn-gold" href="#plan" onClick={(event) => { event.preventDefault(); document.getElementById("plan")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
            Plan a journey
          </a>
          <a className="site-btn site-btn-ghost" href="#destinations" onClick={(event) => { event.preventDefault(); document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
            Explore routes
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
