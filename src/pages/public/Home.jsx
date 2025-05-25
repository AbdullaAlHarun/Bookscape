import headerBg from '../../assets/header_bg.svg';
import Hero from '../../components/home/Hero';
import SearchBar from '../../components/home/SearchBar';
import VenueGrid from "../../components/venues/VenueGrid";

export default function Home() {
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
