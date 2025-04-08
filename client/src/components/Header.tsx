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
                <Volleyball className="text-white mr-2" size={24} />
                <span className="font-bold text-white text-xl">FootTournoi</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  location === item.href 
                    ? 'text-white font-medium' 
                    : 'text-teal-300 hover:text-white'
                }`}>
                  {item.name}
                </a>
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
                  <DropdownMenuItem onClick={() => window.location.href = "/dashboard"}>
                    Tableau de bord
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = `/player/${user?.id}`}>
                    Mon profil
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => window.location.href = "/admin"}>
                      Administration
                    </DropdownMenuItem>
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
                <a
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location === item.href
                      ? 'bg-teal-800 text-white'
                      : 'text-teal-300 hover:bg-teal-800 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
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
                    <a
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tableau de bord
                    </a>
                  </Link>
                  <Link href={`/player/${user?.id}`}>
                    <a
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Mon profil
                    </a>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <a
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Administration
                      </a>
                    </Link>
                  )}
                  <a
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-teal-800 cursor-pointer"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Se déconnecter
                  </a>
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
