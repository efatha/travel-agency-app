import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import BookingForm from "../components/BookingForm";
import { db } from "../firebase/firebase";

function Home() {

  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchCities() {
      try {
        const snapshot = await getDocs(collection(db, "cities"));

        const cityList = snapshot.docs.map(doc => doc.data().City);

        setCities(cityList);

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    }

    fetchCities();

  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <BookingForm
        cities={cities}
        loading={loading}
      />
    </>
  );
}

export default Home;