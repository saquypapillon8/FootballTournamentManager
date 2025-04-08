import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LiveMatches from "@/components/LiveMatches";
import UpcomingMatches from "@/components/UpcomingMatches";
import LeaderboardPreview from "@/components/LeaderboardPreview";

const Home = () => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="bg-teal-700 rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="md:flex">
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-white mb-4">Tournoi de Football - Saison 2023</h1>
              <p className="text-teal-300 mb-6">Suivez tous les matchs en direct, consultez les classements et les statistiques des joueurs.</p>
              <div className="flex space-x-4">
                <Link href="/matches">
                  <Button variant="outline" className="bg-white text-teal-700 hover:bg-gray-100">
                    Voir les matchs
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                    Rejoindre le tournoi
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 bg-teal-800 p-8 flex items-center justify-center">
              <div className="rounded-lg shadow-lg max-h-80 overflow-hidden">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-full w-full object-cover"
                  viewBox="0 0 800 500"
                  fill="none"
                >
                  <rect width="800" height="500" fill="#0F766E" />
                  <circle cx="400" cy="250" r="150" stroke="white" strokeWidth="8" fill="none" />
                  <path d="M400 100 L400 400" stroke="white" strokeWidth="4" strokeDasharray="15,15" />
                  <circle cx="400" cy="250" r="50" stroke="white" strokeWidth="4" fill="none" />
                  <path d="M320 180 L480 320" stroke="white" strokeWidth="3" />
                  <path d="M320 320 L480 180" stroke="white" strokeWidth="3" />
                  <circle cx="400" cy="250" r="10" fill="white" />
                  <text x="300" y="70" fill="white" fontSize="24" fontWeight="bold">FOOTTOURNOI</text>
                  <text x="330" y="450" fill="white" fontSize="18">SAISON 2023</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Live Matches Section */}
        <LiveMatches limit={2} />
        
        {/* Upcoming Matches Section */}
        <UpcomingMatches limit={3} />
        
        {/* Leaderboard Preview */}
        <LeaderboardPreview limit={5} />
      </div>
    </div>
  );
};

export default Home;
