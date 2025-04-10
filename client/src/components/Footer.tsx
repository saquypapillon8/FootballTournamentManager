import { Link } from "wouter";
import { Volleyball, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1500 1500" className="text-white mr-2">
              <path className="fill-current" d="M1096.01,674.38c-6.6-19.1-15.67-36.92-26.76-53.03-24.78-35.95-59.75-63.43-100.35-77.52-.35-.15-.72-.27-1.06-.37h-462.18c-26.84,0-51.87,13.49-66.62,35.9l-62.52,95.01-49.05,74.53-48.53-74.53-85.27-130.91H24.96v389.07c0,13.26,10.75,24.01,24.01,24.01h111.26v-219.62l51.62,84.71,82.19,134.92h67.63l82.65-134.92,51.89-84.71v219.62h461.77c3.7,0,7.39-.56,10.88-1.81.02,0,.04-.01.06-.02,40.6-14.08,75.56-41.56,100.35-77.52,11.59-16.83,20.95-35.51,27.63-55.57,7.54-22.61,11.64-46.97,11.64-72.35s-4.42-51.57-12.5-74.9ZM968.91,765.43c0,31.04-25.15,56.19-56.19,56.19h-145.99v-147.25h145.99c31.04,0,56.19,25.15,56.19,56.19v34.87Z"/>
              <path className="fill-current" d="M1069.25,899.58c20.24-21.92,36.1-48.46,46.11-77.96,7.81-22.98,12.06-47.79,12.06-73.64s-4.25-50.63-12.06-73.61c-10.01-29.53-25.87-56.04-46.11-77.96v-52.95h405.79v107.64h-271.98v46.53h271.98v98.91h-271.98v50.19h271.98v109.81h-348.83c-31.46,0-56.96-25.5-56.96-56.96h0Z"/>
            </svg>
            <span className="font-bold text-white text-lg">Tournoi</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-center md:text-right text-gray-400 text-sm">
              © {new Date().getFullYear()} Tournoi. Tous droits réservés.
            </p>
          </div>
        </div>
        <div className="mt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram size={20} />
            </a>
          </div>
          <nav className="mt-4 md:mt-0 flex flex-wrap justify-center md:justify-start space-x-6 text-sm">
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer">À propos</span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer">Contact</span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer">Conditions d'utilisation</span>
            </Link>
            <Link href="#">
              <span className="text-gray-400 hover:text-white cursor-pointer">Politique de confidentialité</span>
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
