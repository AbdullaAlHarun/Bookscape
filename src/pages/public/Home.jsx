import headerBg from '../../assets/header_bg.svg';
import Hero from '../../components/Home/Hero';
import SearchBar from '../../components/home/SearchBar';

export default function Home() {
  return (
    <section
      className="bg-[#fff8f4] bg-cover bg-no-repeat bg-bottom min-h-[90vh] flex flex-col justify-center items-center px-4 py-12"
      style={{ backgroundImage: `url(${headerBg})` }}
    >
      <Hero />
      <SearchBar />
    </section>
  );
}
