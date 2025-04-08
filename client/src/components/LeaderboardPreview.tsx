import { useQuery } from "@tanstack/react-query";
import { Team } from "@shared/schema";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Volleyball, ArrowRight } from "lucide-react";

interface LeaderboardPreviewProps {
  limit?: number;
}

const LeaderboardPreview = ({ limit = 5 }: LeaderboardPreviewProps) => {
  const { data: teams, isLoading, error } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Classement</h2>
          <Link href="/leaderboard">
            <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
              Voir le classement complet
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-0">
            <div className="h-12 bg-gray-200 w-full"></div>
            {[1, 2, 3, 4, 5].map(i => (
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
          <h2 className="text-2xl font-bold text-gray-900">Classement</h2>
          <Link href="/leaderboard">
            <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
              Voir le classement complet
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Impossible de charger le classement.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Sort teams by points (descending)
  const sortedTeams = [...(teams || [])].sort((a, b) => b.points - a.points);
  const topTeams = sortedTeams.slice(0, limit);

  // Calculate win/draw/loss (this would be better to get from the API)
  const calculateTeamRecord = (team: Team) => {
    // This is a simplified version - in a real app, this would be calculated from match results
    const wins = Math.floor(team.points / 3);
    const draws = team.points % 3;
    const losses = team.matchesPlayed - wins - draws;
    
    return { wins, draws, losses };
  };

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Classement</h2>
        <Link href="/leaderboard">
          <a className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium">
            Voir le classement complet
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {topTeams.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Équipe</TableHead>
                    <TableHead className="text-center">MJ</TableHead>
                    <TableHead className="text-center">G</TableHead>
                    <TableHead className="text-center">N</TableHead>
                    <TableHead className="text-center">P</TableHead>
                    <TableHead className="text-center">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topTeams.map((team, index) => {
                    const { wins, draws, losses } = calculateTeamRecord(team);
                    const isFirst = index === 0;
                    
                    return (
                      <TableRow 
                        key={team.id}
                        className={isFirst ? "bg-green-50" : ""}
                      >
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 bg-gray-100 mr-4">
                              <AvatarFallback>
                                <Volleyball className="h-5 w-5 text-gray-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium text-gray-900">
                              {team.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-500">
                          {team.matchesPlayed}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-500">
                          {wins}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-500">
                          {draws}
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-500">
                          {losses}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {team.points}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Aucune équipe disponible pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default LeaderboardPreview;
