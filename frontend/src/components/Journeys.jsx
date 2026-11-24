import { Link } from "react-router-dom";

const JOURNEYS = [
  {
    title: "Migration & the Mara",
    span: "8 days · Kenya & Tanzania",
    text: "River crossings at first light, then a slow drive south into the Serengeti plains as the herds thin into gold.",
    price: "From $3,450",
  },
  {
    title: "Crater, peak, and spice",
    span: "10 days · Tanzania",
    text: "Ngorongoro at dawn, a Kilimanjaro foothills walk, and Stone Town evenings scented with clove and sea salt.",
    price: "From $3,980",
  },
  {
    title: "Forest to the reef",
    span: "9 days · Uganda & Kenya",
    text: "Gorilla track in Bwindi, a night flight east, then dhow silence off Lamu and sand at Diani.",
    price: "From $4,260",
  },
];

function Journeys() {
  return (
    <section className="site-section site-journeys" id="journeys">
      <div className="site-section-head">
        <p className="site-eyebrow site-eyebrow-gold">Signature journeys</p>
        <h2>Routes we would take ourselves</h2>
      </div>
      <div className="journey-list">
        {JOURNEYS.map((journey) => (
          <article key={journey.title} className="journey-card">
            <p className="journey-span">{journey.span}</p>
            <h3>{journey.title}</h3>
            <p>{journey.text}</p>
            <div className="journey-foot">
              <strong>{journey.price}</strong>
              <Link to="/booking">Plan this journey</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Journeys;
