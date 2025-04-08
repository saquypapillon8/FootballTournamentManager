import { useQuery } from "@tanstack/react-query";
import { Match } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Volleyball, ArrowRight } from "lucide-react";

interface LiveMatchesProps {
  limit?: number;
}

const LiveMatches = ({ limit }: LiveMatchesProps) => {
  const { data: liveMatches, isLoading, error } = useQuery<Match[]>({
    queryKey: ["/api/matches/live"],
  });

  // Helper function to format match duration
  const getMatchDuration = (match: Match) => {
    const matchDate = new Date(match.matchDate);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - matchDate.getTime()) / (1000 * 60));
    return `${diffInMinutes} min`;
  };

  // Get team data from the API
  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Find team by ID
  const getTeamById = (id: number) => {
    return teams?.find(team => team.id === id) || { name: "Équipe inconnue", logo: "" };
  };

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Matchs en direct</h2>
          <Link href="/matches">
            <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
              Voir tous les matchs
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-4 text-center">
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Matchs en direct</h2>
          <Link href="/matches">
            <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
              Voir tous les matchs
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Impossible de charger les matchs en direct.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const displayMatches = limit ? liveMatches?.slice(0, limit) : liveMatches;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Matchs en direct</h2>
        <Link href="/matches">
          <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
            Voir tous les matchs
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      {displayMatches && displayMatches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayMatches.map((match) => {
            const team1 = getTeamById(match.team1Id);
            const team2 = getTeamById(match.team2Id);
            
            return (
              <Card key={match.id} className="overflow-hidden border-l-4 border-red-400">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="destructive">EN DIRECT</Badge>
                    <span className="text-sm text-gray-500">{getMatchDuration(match)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 bg-gray-200">
                        <AvatarFallback className="bg-gray-100">
                          <Volleyball className="h-6 w-6 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{team1.name}</p>
                        <p className="text-xs text-gray-500">Domicile</p>
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold px-3 py-1 bg-gray-100 rounded">
                      {match.scoreTeam1}
                    </div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 bg-gray-200">
                        <AvatarFallback className="bg-gray-100">
                          <Volleyball className="h-6 w-6 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold">{team2.name}</p>
                        <p className="text-xs text-gray-500">Extérieur</p>
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold px-3 py-1 bg-gray-100 rounded">
                      {match.scoreTeam2}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Link href={`/matches/${match.id}`}>
                      <Button variant="link" className="text-indigo-600 hover:text-indigo-700">
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Aucun match en cours pour le moment.</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
};

export default LiveMatches;
