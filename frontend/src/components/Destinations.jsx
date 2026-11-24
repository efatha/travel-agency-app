const DESTINATIONS = [
  {
    name: "Serengeti",
    country: "Tanzania",
    line: "Gold grass, distant thunder, and a river of wildebeest.",
    days: "6 days",
    price: "From $2,480",
    image:
      "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Zanzibar",
    country: "Tanzania",
    line: "Clove wind, dhow sails, and water the color of glass.",
    days: "5 days",
    price: "From $1,640",
    image:
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Kilimanjaro",
    country: "Tanzania",
    line: "Cold stars above the glaciers, then the roof of Africa.",
    days: "7 days",
    price: "From $2,190",
    image:
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Masai Mara",
    country: "Kenya",
    line: "Acacia shade, red roads, and cats in the late light.",
    days: "5 days",
    price: "From $2,120",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Ngorongoro",
    country: "Tanzania",
    line: "A green bowl of mist, buffalo, and crater-floor silence.",
    days: "3 days",
    price: "From $980",
    image:
      "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Bwindi",
    country: "Uganda",
    line: "Wet forest, bird calls, and gorillas a few breaths away.",
    days: "4 days",
    price: "From $1,860",
    image:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Lamu",
    country: "Kenya",
    line: "Coral stone, donkey bells, and a tide that keeps its own hours.",
    days: "4 days",
    price: "From $1,240",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Diani",
    country: "Kenya",
    line: "Powder sand, baobab shade, and a reef just offshore.",
    days: "4 days",
    price: "From $890",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
];

function Destinations() {
  return (
    <section className="site-section" id="destinations">
      <div className="site-section-head">
        <p className="site-eyebrow site-eyebrow-ink">Where the light changes</p>
        <h2>Destinations worth the long road</h2>
        <p>
          Eight places we return to — savanna, crater, forest, and the warm
          edge of the Indian Ocean.
        </p>
      </div>
      <div className="dest-grid">
        {DESTINATIONS.map((place) => (
          <article key={place.name} className="dest-card">
            <img src={place.image} alt="" />
            <div className="dest-card-body">
              <p className="dest-country">{place.country}</p>
              <h3>{place.name}</h3>
              <p>{place.line}</p>
              <div className="dest-meta">
                <span>{place.days}</span>
                <strong>{place.price}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Destinations;
