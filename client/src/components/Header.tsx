import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Volleyball, User, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Matchs", href: "/matches" },
    { name: "Équipes", href: "/teams" },
    { name: "Classement", href: "/leaderboard" }
  ];

  return (
    <header className="bg-teal-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1500 1500" className="text-white mr-2">
                  <path className="fill-current" d="M1096.01,674.38c-6.6-19.1-15.67-36.92-26.76-53.03-24.78-35.95-59.75-63.43-100.35-77.52-.35-.15-.72-.27-1.06-.37h-462.18c-26.84,0-51.87,13.49-66.62,35.9l-62.52,95.01-49.05,74.53-48.53-74.53-85.27-130.91H24.96v389.07c0,13.26,10.75,24.01,24.01,24.01h111.26v-219.62l51.62,84.71,82.19,134.92h67.63l82.65-134.92,51.89-84.71v219.62h461.77c3.7,0,7.39-.56,10.88-1.81.02,0,.04-.01.06-.02,40.6-14.08,75.56-41.56,100.35-77.52,11.59-16.83,20.95-35.51,27.63-55.57,7.54-22.61,11.64-46.97,11.64-72.35s-4.42-51.57-12.5-74.9ZM968.91,765.43c0,31.04-25.15,56.19-56.19,56.19h-145.99v-147.25h145.99c31.04,0,56.19,25.15,56.19,56.19v34.87Z"/>
                  <path className="fill-current" d="M1069.25,899.58c20.24-21.92,36.1-48.46,46.11-77.96,7.81-22.98,12.06-47.79,12.06-73.64s-4.25-50.63-12.06-73.61c-10.01-29.53-25.87-56.04-46.11-77.96v-52.95h405.79v107.64h-271.98v46.53h271.98v98.91h-271.98v50.19h271.98v109.81h-348.83c-31.46,0-56.96-25.5-56.96-56.96h0Z"/>
                </svg>
                <span className="font-bold text-white text-xl">FootTournoi</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  location === item.href 
                    ? 'text-white font-medium' 
                    : 'text-teal-300 hover:text-white'
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            {!isAuthenticated ? (
              <div className="flex space-x-4">
                <Link href="/login">
                  <Button variant="outline" className="bg-white text-teal-700 hover:bg-gray-100">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 bg-gray-200">
                      <AvatarFallback className="bg-teal-700 text-white">
                        {user?.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                      Tableau de bord
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/player/${user?.id}`}>
                    <DropdownMenuItem>
                      Mon profil
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <DropdownMenuItem>
                        Administration
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-teal-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <span
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location === item.href
                      ? 'bg-teal-800 text-white'
                      : 'text-teal-300 hover:bg-teal-800 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
          
          <div className="pt-4 pb-3 border-t border-teal-700">
            {!isAuthenticated ? (
              <div className="flex items-center justify-around px-5">
                <Link href="/login">
                  <Button 
                    variant="outline" 
                    className="bg-white text-teal-700 hover:bg-gray-100 w-5/12"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    className="bg-indigo-600 text-white hover:bg-indigo-700 w-5/12"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 bg-teal-700 text-white">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.name}</div>
                    <div className="text-sm font-medium text-teal-300">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link href="/dashboard">
                    <span
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tableau de bord
                    </span>
                  </Link>
                  <Link href={`/player/${user?.id}`}>
                    <span
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mon profil
                    </span>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <span
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Administration
                      </span>
                    </Link>
                  )}
                  <span
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800 cursor-pointer"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Se déconnecter
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
