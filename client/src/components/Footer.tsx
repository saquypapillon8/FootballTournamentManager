import { Link } from "wouter";
import { Volleyball, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center">
            <Volleyball className="text-white mr-2" size={20} />
            <span className="font-bold text-white text-lg">FootTournoi</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-center md:text-right text-gray-400 text-sm">
              © {new Date().getFullYear()} FootTournoi. Tous droits réservés.
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
