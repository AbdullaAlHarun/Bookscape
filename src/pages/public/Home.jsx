import { useEffect } from "react";
import headerBg from '../../assets/header_bg.svg';
import Hero from '../../components/Home/Hero';
import SearchBar from '../../components/home/SearchBar';
import VenueGrid from "../../components/venues/VenueGrid";

export default function Home() {
  useEffect(() => {
    document.title = "BookScape | Home";

    const metaTags = [
      { name: "description", content: "Discover and book the perfect venue for your next holiday or event. Explore trusted and reviewed venues across the globe with BookScape." },
      { property: "og:title", content: "BookScape | Discover Unique Stays" },
      { property: "og:description", content: "Explore trusted and reviewed venues worldwide. Book your next adventure with BookScape." },
      { property: "og:image", content: "/favicon-512x512.png" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "BookScape | Discover Unique Stays" },
      { name: "twitter:description", content: "Explore trusted and reviewed venues worldwide. Book your next adventure with BookScape." },
      { name: "twitter:image", content: "/favicon-512x512.png" },
    ];

    metaTags.forEach(tag => {
      const selector = tag.name
        ? `meta[name="${tag.name}"]`
        : `meta[property="${tag.property}"]`;

      let meta = document.head.querySelector(selector);

      if (!meta) {
        meta = document.createElement("meta");
        if (tag.name) meta.setAttribute("name", tag.name);
        if (tag.property) meta.setAttribute("property", tag.property);
        document.head.appendChild(meta);
      }

      meta.setAttribute("content", tag.content);
    });
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
