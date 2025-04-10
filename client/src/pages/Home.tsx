
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import LiveMatches from "@/components/LiveMatches";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
                <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
                  <CarouselContent>
                    <CarouselItem>
                      <img 
                        src="/images/1.jpg" 
                        alt="Football Tournament 1"
                        className="w-full h-80 object-cover"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <img 
                        src="/images/2.jpg" 
                        alt="Football Tournament 2"
                        className="w-full h-80 object-cover"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <img 
                        src="/images/3.jpg" 
                        alt="Football Tournament 3"
                        className="w-full h-80 object-cover"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sections des matchs et classements */}
        <div className="space-y-8">
          <LiveMatches limit={2} />
          <UpcomingMatches limit={3} />
          <LeaderboardPreview limit={5} />
        </div>
      </div>
    </div>
  );
};

export default Home;
