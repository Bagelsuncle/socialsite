import Hero from "./components/(public)/Hero";
import Footer from "./components/(public)/Footer";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <main className="flex flex-col items-center pt-48 px-4 bg-gradient-to-br from-white to-white">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
