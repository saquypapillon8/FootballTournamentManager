import { useQuery } from "@tanstack/react-query";
import { Match } from "@shared/schema";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Volleyball, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface UpcomingMatchesProps {
  limit?: number;
}

const UpcomingMatches = ({ limit }: UpcomingMatchesProps) => {
  const { data: upcomingMatches, isLoading, error } = useQuery<Match[]>({
    queryKey: ["/api/matches/upcoming"],
  });

  // Get team data from the API
  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Find team by ID
  const getTeamById = (id: number) => {
    return teams?.find(team => team.id === id) || { name: "Équipe inconnue", logo: "" };
  };

  // Format match date
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM, HH:mm", { locale: fr });
  };

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Matchs à venir</h2>
          <Link href="/matches">
            <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
              Voir tous les matchs
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-0">
            <div className="h-12 bg-gray-200 w-full"></div>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Matchs à venir</h2>
          <Link href="/matches">
            <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
              Voir tous les matchs
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Impossible de charger les matchs à venir.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const displayMatches = limit ? upcomingMatches?.slice(0, limit) : upcomingMatches;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Matchs à venir</h2>
        <Link href="/matches">
          <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
            Voir tous les matchs
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {displayMatches && displayMatches.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Équipe Domicile</TableHead>
                    <TableHead className="text-center">VS</TableHead>
                    <TableHead>Équipe Extérieur</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayMatches.map((match) => {
                    const team1 = getTeamById(match.team1Id);
                    const team2 = getTeamById(match.team2Id);
                    
                    return (
                      <TableRow key={match.id}>
                        <TableCell className="text-sm text-gray-500">
                          {formatMatchDate(match.matchDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 bg-gray-100 mr-4">
                              <AvatarFallback>
                                <Volleyball className="h-5 w-5 text-gray-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium text-gray-900">
                              {team1.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium">
                          VS
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 bg-gray-100 mr-4">
                              <AvatarFallback>
                                <Volleyball className="h-5 w-5 text-gray-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium text-gray-900">
                              {team2.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                            À venir
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Aucun match à venir pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default UpcomingMatches;
