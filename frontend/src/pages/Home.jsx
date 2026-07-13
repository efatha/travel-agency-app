import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookingForm from "../components/BookingForm";

import { db } from "../firebase/firebase";

function Home() {
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  useEffect(() => {
    const trackVisit = async () => {
      try {
        await addDoc(collection(db, "actions"), {
          action: "VIEW_HOME",
          page: "Home",
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error("Tracking error:", error);
      }
    };

    const citiesRef = collection(db, "cities");
    const unsubscribe = onSnapshot(
      citiesRef,
      (snapshot) => {
        const cityList = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return data.name || data.city || data.county || data.title || data.destination || doc.id;
          })
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b));

        setCities(cityList);
        setLoadingCities(false);
      },
      (error) => {
        console.error("Cities fetch error:", error);
        setLoadingCities(false);
      }
    );

    trackVisit();

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <BookingForm cities={cities} loading={loadingCities} />
    </>
  );
}

export default Home;