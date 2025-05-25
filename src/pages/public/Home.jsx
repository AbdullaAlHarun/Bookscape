import { useEffect } from "react";
import headerBg from '../../assets/header_bg.svg';
import Hero from '../../components/Home/Hero';
import SearchBar from '../../components/home/SearchBar';
import VenueGrid from "../../components/venues/VenueGrid";

export default function Home() {
  useEffect(() => {
    document.title = "BookScape | Home";
    
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", "Discover and book the perfect venue for your next holiday or event. Explore trusted and reviewed venues across the globe with BookScape.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Discover and book the perfect venue for your next holiday or event. Explore trusted and reviewed venues across the globe with BookScape.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <>
      <section
        className="bg-[#fff8f4] bg-cover bg-no-repeat bg-bottom min-h-[90vh] flex flex-col justify-center items-center px-4 py-12"
        style={{ backgroundImage: `url(${headerBg})` }}
      >
        <Hero />
        <SearchBar />
      </section>

      <section
        aria-labelledby="venue-listing-heading"
        className="container mx-auto px-4 py-12"
      >
        <h2
          id="venue-listing-heading"
          className="text-2xl font-bold mb-6 text-center"
        >
          Available Venues
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Explore our curated selection of venues perfect for any occasion.
        </p>

        <VenueGrid />
      </section>
    </>
  );
}
