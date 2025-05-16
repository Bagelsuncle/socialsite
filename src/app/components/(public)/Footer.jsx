import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="absolute inset-0 z-[-1] bottom-0">
        <Image
          src="/assets/logo-grid.png" // You might want to use a different image for the background
          alt="Background"
          fill
          className="object-cover opacity-25"
          priority
        />
        {/* Overlay to ensure text is readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600/70 to-purple-500/70"></div>
      </div>
      <div className="bg-gradient-to-br from-gray-300 to-gray-400 py-48 px-4 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-20 justify-center">
          <div id="logo" className="flex items-center mb-6 md:mb-0">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={200}
              height={200}
              className="rounded-full bg-gradient-to-br from-gray-600 to-gray-400 p-1"
            />
            <span className="text-9xl ml-2 font-bold text-white">AppName!</span>
          </div>

          <div className="flex justify-center gap-6">
            <a href="#" className="text-white hover:text-gray-100 transition">
              About
            </a>
            <a href="#" className="text-white hover:text-gray-100 transition">
              Privacy
            </a>
            <a href="#" className="text-white hover:text-gray-100 transition">
              Terms
            </a>
            <a href="#" className="text-white hover:text-gray-100 transition">
              Help
            </a>
          </div>
        </div>
      </div>
      <div className="bg-white mt-auto text-center text-zinc-900 text-xs">
        © {new Date().getFullYear()} AppName! All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
