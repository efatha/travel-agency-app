const REASONS = [
  {
    title: "Guides who grew up here",
    text: "Trackers and drivers from the parks and the coast, not a script read from a coach seat.",
  },
  {
    title: "Small camps, open sky",
    text: "Canvas and coral-stone lodges chosen for the view at dusk, not the size of the lobby.",
  },
  {
    title: "One desk for the whole arc",
    text: "Park fees, bush flights, and dhow crossings held in a single itinerary you can actually follow.",
  },
];

function WhyStrip() {
  return (
    <section className="why-strip" aria-label="Why travel with us">
      <div className="why-intro">
        <p className="site-eyebrow site-eyebrow-gold">Why travel with us</p>
        <h2>The feeling of the road, kept intact.</h2>
      </div>
      <ul>
        {REASONS.map((reason) => (
          <li key={reason.title}>
            <h3>{reason.title}</h3>
            <p>{reason.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default WhyStrip;
