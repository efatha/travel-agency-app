export const destinations = [
  {
    id: "serengeti",
    name: "Serengeti",
    country: "Tanzania",
    region: "Northern Tanzania",
    tagline: "Endless plains and the great migration",
    summary:
      "A classic northern-circuit safari across open grassland, kopjes, and river crossings where wildebeest and predators still move with the rains.",
    days: 6,
    priceFrom: 2450,
    highlights: ["Great migration corridors", "Big-cat game drives", "Balloon sunrise over the plains"],
    image: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "June to October",
  },
  {
    id: "zanzibar",
    name: "Zanzibar",
    country: "Tanzania",
    region: "Zanzibar Archipelago",
    tagline: "Spice islands and a slow Swahili coast",
    summary:
      "Stone Town alleys, reef snorkelling, and white-sand beaches on Unguja, with dhow days between the historic waterfront and the east coast.",
    days: 5,
    priceFrom: 980,
    highlights: ["Stone Town", "Spice farms", "East-coast reefs"],
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "June to October and December to February",
  },
  {
    id: "kilimanjaro",
    name: "Kilimanjaro",
    country: "Tanzania",
    region: "Kilimanjaro",
    tagline: "The roof of Africa, walked from the forest to the crater rim",
    summary:
      "A guided climb through rainforest, moorland, and alpine desert to Uhuru Peak, with acclimatisation days built into the route.",
    days: 7,
    priceFrom: 1890,
    highlights: ["Machame or Lemosho route", "Summit night", "Rainforest to glacier zones"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "January to March and June to October",
  },
  {
    id: "masai-mara",
    name: "Masai Mara",
    country: "Kenya",
    region: "Rift Valley",
    tagline: "Kenya's famous reserve on the migration's northern bank",
    summary:
      "Wide savanna south of Narok, river crossings on the Mara, and conservancy stays that keep game drives away from the busiest tracks.",
    days: 4,
    priceFrom: 1650,
    highlights: ["Mara River crossings", "Conservancy drives", "Maasai community visits"],
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "July to October",
  },
  {
    id: "ngorongoro",
    name: "Ngorongoro",
    country: "Tanzania",
    region: "Ngorongoro Highlands",
    tagline: "A crater floor dense with wildlife",
    summary:
      "Descend into the Ngorongoro caldera for a full day among elephants, lions, and flamingos on the soda lake, then overnight on the rim.",
    days: 3,
    priceFrom: 1420,
    highlights: ["Crater floor game drive", "Highland rim views", "Maasai pastoral landscape"],
    image: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "June to September",
  },
  {
    id: "bwindi",
    name: "Bwindi Impenetrable",
    country: "Uganda",
    region: "Southwestern Uganda",
    tagline: "Mountain gorillas in ancient forest",
    summary:
      "A tracked gorilla trek in Bwindi Impenetrable National Park, with forest lodges near Buhoma or Rushaga and time for community walks.",
    days: 4,
    priceFrom: 2100,
    highlights: ["Gorilla trekking permit", "Forest trails", "Batwa cultural walk"],
    image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "June to August and December to February",
  },
  {
    id: "lamu",
    name: "Lamu",
    country: "Kenya",
    region: "North Coast",
    tagline: "A car-free Swahili island town",
    summary:
      "Donkeys, carved doors, and dhows in Lamu Old Town, with sandbank sails toward Manda and quiet beach time at Shela.",
    days: 4,
    priceFrom: 890,
    highlights: ["Lamu Old Town", "Dhow to the sandbanks", "Shela beach"],
    image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "July to October and December to March",
  },
  {
    id: "diani",
    name: "Diani",
    country: "Kenya",
    region: "South Coast",
    tagline: "A long reef beach south of Mombasa",
    summary:
      "Palm-lined beach days at Diani, with a marine park snorkel and an easy hop from Mombasa or Ukunda.",
    days: 5,
    priceFrom: 720,
    highlights: ["Diani Beach", "Kisite-Mpunguti marine park", "Colobus forest walk"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "January to March and July to October",
  },
  {
    id: "lake-nakuru",
    name: "Lake Nakuru",
    country: "Kenya",
    region: "Great Rift Valley",
    tagline: "Flamingos, rhinos, and a rift-valley lake",
    summary:
      "A compact park between Nairobi and the Mara, known for soda-lake birds, both rhino species, and viewpoints above the water.",
    days: 2,
    priceFrom: 640,
    highlights: ["Flamingo shoreline", "Rhino tracking", "Baboon cliff lookout"],
    image: "https://images.unsplash.com/photo-1495312040802-a9298d6104f0?auto=format&fit=crop&w=1400&q=80",
    bestSeason: "June to September",
  },
];

export const journeys = [
  {
    id: "mara-migration",
    title: "Mara migration safari",
    from: "Nairobi",
    to: "Masai Mara",
    days: 4,
    priceFrom: 1650,
    style: "safari",
    summary:
      "Fly or drive from Nairobi into the Masai Mara for river crossings, predator tracking, and a night in a conservancy camp.",
  },
  {
    id: "zanzibar-coast",
    title: "Swahili coast and Stone Town",
    from: "Dar es Salaam",
    to: "Zanzibar",
    days: 5,
    priceFrom: 980,
    style: "coast",
    summary:
      "Ferry from Dar es Salaam to Zanzibar for Stone Town, a spice tour, and two nights on the east-coast reefs.",
  },
  {
    id: "kili-summit",
    title: "Kilimanjaro summit trek",
    from: "Arusha",
    to: "Kilimanjaro",
    days: 7,
    priceFrom: 1890,
    style: "mountain",
    summary:
      "Start in Arusha, trek a seven-day Kilimanjaro route with rest days, and descend to a celebration in Moshi.",
  },
  {
    id: "bwindi-gorillas",
    title: "Bwindi gorilla trek",
    from: "Entebbe",
    to: "Bwindi Impenetrable",
    days: 4,
    priceFrom: 2100,
    style: "primate",
    summary:
      "Leave Entebbe for southwestern Uganda, trek a habituated gorilla family in Bwindi, and return via Lake Mburo.",
  },
];

const hubCities = ["Nairobi", "Arusha", "Entebbe", "Dar es Salaam", "Zanzibar", "Mombasa"];

export const cities = [...new Set([...destinations.map((place) => place.name), ...hubCities])].sort((a, b) =>
  a.localeCompare(b)
);
