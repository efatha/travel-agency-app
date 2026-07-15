import { useEffect, useState } from "react";
import { collection, collectionGroup, getDocs } from "firebase/firestore";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookingForm from "../components/BookingForm";
import { db } from "../firebase/firebase";

function extractCity(data) {
  const candidateValues = [
    data?.city,
    data?.City,
    data?.cityName,
    data?.CityName,
    data?.destination?.city,
    data?.destination?.City,
    data?.destination?.name,
    data?.destination?.destination,
    data?.location?.city,
    data?.location?.name,
    data?.name,
    data?.title,
  ];

  for (const value of candidateValues) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const [tripSnapshot, actionSnapshot] = await Promise.all([
          getDocs(collection(db, "trips")),
          getDocs(collectionGroup(db, "actions")),
        ]);

        const collectedCities = [...tripSnapshot.docs, ...actionSnapshot.docs]
          .map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
          .map(({ id, data }) => {
            const city = extractCity(data);
            if (city) {
              console.log("Found city from document", id, "=>", city);
            }
            return city;
          })
          .filter(Boolean);

        const uniqueCities = [...new Set(collectedCities)];

        setTrips(uniqueCities);
      } catch (error) {
        console.error("Firestore error:", error);
        setTrips([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <BookingForm cities={trips} loading={loading} />
    </>
  );
}

export default Home;