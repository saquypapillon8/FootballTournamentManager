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
            <span className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium cursor-pointer">
              Voir le classement complet
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
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
            <span className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium cursor-pointer">
              Voir le classement complet
              <ArrowRight className="ml-1 h-4 w-4" />
            </span>
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

  // Calculate win/loss record for each team
  const calculateTeamRecord = (team: Team) => {
    const wins = team.wins || 0;
    const losses = team.losses || 0;
    const draws = team.draws || 0;
    
    return {
      wins,
      losses,
      draws,
      total: wins + losses + draws,
      points: team.points || 0,
      winRate: team.total ? Math.round((wins / team.total) * 100) : 0
    };
  };

  // Sort teams by points
  const sortedTeams = [...(teams || [])].sort((a, b) => {
    return (b.points || 0) - (a.points || 0);
  });

  // Limit number of teams to display
  const teamsToDisplay = limit ? sortedTeams.slice(0, limit) : sortedTeams;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Classement</h2>
        <Link href="/leaderboard">
          <span className="text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium cursor-pointer">
            Voir le classement complet
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {teamsToDisplay && teamsToDisplay.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Équipe</TableHead>
                    <TableHead className="text-center">J</TableHead>
                    <TableHead className="text-center">V</TableHead>
                    <TableHead className="text-center">N</TableHead>
                    <TableHead className="text-center">D</TableHead>
                    <TableHead className="text-center">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamsToDisplay.map((team, index) => {
                    const record = calculateTeamRecord(team);
                    
                    return (
                      <TableRow key={team.id} className={index < 3 ? "bg-green-50" : ""}>
                        <TableCell className="text-center font-bold">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 bg-gray-100 mr-2">
                              <AvatarFallback>
                                <Volleyball className="h-4 w-4 text-gray-400" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium text-sm">{team.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{record.total}</TableCell>
                        <TableCell className="text-center">{record.wins}</TableCell>
                        <TableCell className="text-center">{record.draws}</TableCell>
                        <TableCell className="text-center">{record.losses}</TableCell>
                        <TableCell className="text-center font-bold">{record.points}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">Aucune équipe dans le classement pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default LeaderboardPreview;
