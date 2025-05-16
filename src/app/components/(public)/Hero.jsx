import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="max-w-4xl mx-auto text-center pb-60">
      <div className="flex flex-col items-center justify-center mb-4">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={90}
          height={90}
          className="rounded-full bg-gradient-to-br from-gray-600 to-gray-400 p-1 shadow-md"
          priority
        />
        <h1 className="ml-2 font-bold text-gray-800 text-lg">AppName!</h1>
      </div>
      <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent">
        This is the hero section text!
      </h2>

      <h3 className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        This is the hero subtitle text. It should be a brief description of the
        product or service being offered.
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
        <Link href="/signup">
          <button className="cursor-pointer bg-gray-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 flex items-center">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </Link>
        <Link href="/login">
          <button className="cursor-pointer text-gray-600 font-medium py-4 px-8 rounded-full border-2 border-gray-600 hover:bg-gray-50 transition duration-300">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
