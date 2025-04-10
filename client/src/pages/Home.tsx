import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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
              <div className="rounded-lg shadow-lg max-h-80 overflow-hidden w-full">
                <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
                  <CarouselContent>
                    {["/attached_assets/1.jpg", "/attached_assets/2.jpg", "/attached_assets/3.jpg"].map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="relative w-full aspect-[8/5]">
                          <img
                            src={src}
                            alt={`Slide ${index + 1}`}
                            className="object-cover w-full h-full rounded-lg"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
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
