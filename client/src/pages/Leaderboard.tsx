import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Team } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Volleyball, TrendingUp, ArrowUpDown } from "lucide-react";

const Leaderboard = () => {
  const [sortField, setSortField] = useState<string>("points");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Get all teams
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Calculate win/draw/loss for each team (simplified version)
  const calculateTeamRecord = (team: Team) => {
    const wins = Math.floor(team.points / 3);
    const draws = team.points % 3;
    const losses = team.matchesPlayed - wins - draws;
    
    return { wins, draws, losses };
  };

  // Sort teams
  const sortedTeams = teams 
    ? [...teams].sort((a, b) => {
        const aValue = sortField === "wins" ? Math.floor(a.points / 3) :
                      sortField === "draws" ? a.points % 3 :
                      sortField === "losses" ? a.matchesPlayed - Math.floor(a.points / 3) - (a.points % 3) :
                      a[sortField as keyof Team];
                      
        const bValue = sortField === "wins" ? Math.floor(b.points / 3) :
                      sortField === "draws" ? b.points % 3 :
                      sortField === "losses" ? b.matchesPlayed - Math.floor(b.points / 3) - (b.points % 3) :
                      b[sortField as keyof Team];
                      
        if (sortDirection === "asc") {
          return (aValue as number) - (bValue as number);
        } else {
          return (bValue as number) - (aValue as number);
        }
      })
    : [];

  // Handle sort change
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-gray-400" />;
    }
    
    return sortDirection === "asc" 
      ? <ArrowUpDown className="h-4 w-4 ml-1 text-teal-700" /> 
      : <ArrowUpDown className="h-4 w-4 ml-1 text-teal-700" />;
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Classement</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Classement du tournoi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Classement général</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {teams && teams.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Position</TableHead>
                        <TableHead>Équipe</TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-medium flex items-center -ml-3 px-2"
                            onClick={() => handleSort("matchesPlayed")}
                          >
                            MJ {getSortIcon("matchesPlayed")}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-medium flex items-center -ml-3 px-2"
                            onClick={() => handleSort("wins")}
                          >
                            G {getSortIcon("wins")}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-medium flex items-center -ml-3 px-2"
                            onClick={() => handleSort("draws")}
                          >
                            N {getSortIcon("draws")}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-medium flex items-center -ml-3 px-2"
                            onClick={() => handleSort("losses")}
                          >
                            P {getSortIcon("losses")}
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="font-medium flex items-center -ml-3 px-2"
                            onClick={() => handleSort("points")}
                          >
                            Points {getSortIcon("points")}
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTeams.map((team, index) => {
                        const { wins, draws, losses } = calculateTeamRecord(team);
                        const isTop = index < 3;
                        
                        return (
                          <TableRow 
                            key={team.id}
                            className={
                              index === 0 
                                ? "bg-green-50" 
                                : index === 1 || index === 2 
                                ? "bg-green-50/50" 
                                : ""
                            }
                          >
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {index === 0 && (
                                  <span className="bg-yellow-400 text-yellow-800 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                    1
                                  </span>
                                )}
                                {index === 1 && (
                                  <span className="bg-gray-300 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                    2
                                  </span>
                                )}
                                {index === 2 && (
                                  <span className="bg-amber-600 text-amber-100 rounded-full w-6 h-6 flex items-center justify-center mr-2">
                                    3
                                  </span>
                                )}
                                {index > 2 && (
                                  <span className="w-6 h-6 flex items-center justify-center mr-2">
                                    {index + 1}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 bg-gray-100 mr-4">
                                  <AvatarFallback className={isTop ? "bg-green-100" : "bg-gray-100"}>
                                    <Volleyball className={`h-5 w-5 ${isTop ? "text-green-600" : "text-gray-400"}`} />
                                  </AvatarFallback>
                                </Avatar>
                                <Link href={`/teams/${team.id}`}>
                                  <a className="text-sm font-medium text-gray-900 hover:text-teal-700">
                                    {team.name}
                                  </a>
                                </Link>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {team.matchesPlayed}
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {wins}
                            </TableCell>
                            <TableCell className="text-center text-sm">
                              {draws}
                            </TableCell>
                            <TableCell className="text-center text-sm">
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
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              {teams && teams.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Équipe avec le plus de points
                    </h3>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          <Volleyball className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {[...teams].sort((a, b) => b.points - a.points)[0].name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {[...teams].sort((a, b) => b.points - a.points)[0].points} points
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Répartition des points
                    </h3>
                    <div className="space-y-3">
                      {sortedTeams.slice(0, 5).map((team, index) => (
                        <div key={team.id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{team.name}</span>
                            <span className="font-medium">{team.points} pts</span>
                          </div>
                          <Progress value={
                            (team.points / Math.max(...teams.map(t => t.points))) * 100
                          } className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Matchs joués
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total des matchs:</span>
                      <span className="font-medium">
                        {teams.reduce((sum, team) => sum + team.matchesPlayed, 0) / 2}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Moyenne par équipe:</span>
                      <span className="font-medium">
                        {(teams.reduce((sum, team) => sum + team.matchesPlayed, 0) / teams.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500">Pas de données disponibles</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Performance des équipes</CardTitle>
          </CardHeader>
          <CardContent>
            {teams && teams.length > 0 ? (
              <div className="space-y-6">
                {sortedTeams.map((team) => {
                  const { wins, draws, losses } = calculateTeamRecord(team);
                  const winPercentage = team.matchesPlayed > 0 
                    ? (wins / team.matchesPlayed) * 100 
                    : 0;
                  
                  return (
                    <div key={team.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback className="bg-gray-100">
                              <Volleyball className="h-4 w-4 text-gray-400" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className={`h-4 w-4 mr-1 ${
                            winPercentage >= 60 
                              ? "text-green-500" 
                              : winPercentage >= 40 
                              ? "text-amber-500" 
                              : "text-red-500"
                          }`} />
                          <span className="text-sm font-medium">
                            {Math.round(winPercentage)}% de victoires
                          </span>
                        </div>
                      </div>
                      <div className="flex h-3 overflow-hidden rounded-full bg-gray-200">
                        {/* Win bar */}
                        <div 
                          style={{ width: `${(wins / Math.max(team.matchesPlayed, 1)) * 100}%` }} 
                          className="bg-green-500"
                          title={`${wins} victoires`}
                        />
                        {/* Draw bar */}
                        <div 
                          style={{ width: `${(draws / Math.max(team.matchesPlayed, 1)) * 100}%` }} 
                          className="bg-amber-500"
                          title={`${draws} nuls`}
                        />
                        {/* Loss bar */}
                        <div 
                          style={{ width: `${(losses / Math.max(team.matchesPlayed, 1)) * 100}%` }} 
                          className="bg-red-500"
                          title={`${losses} défaites`}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span>V: {wins}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                          <span>N: {draws}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          <span>D: {losses}</span>
                        </div>
                        <div className="font-medium">
                          {team.points} pts
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500">Aucune équipe disponible pour le moment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
