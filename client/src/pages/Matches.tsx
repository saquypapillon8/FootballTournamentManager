import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Match } from "@shared/schema";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Volleyball, Search, Calendar, Clock } from "lucide-react";
import LiveMatches from "@/components/LiveMatches";

const Matches = () => {
  const [matchDetailsId, setMatchDetailsId] = useState<number | null>(null);

  // Get all matches
  const { data: allMatches, isLoading: isAllMatchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
  });

  // Get live matches
  const { data: liveMatches, isLoading: isLiveMatchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches/live"],
  });

  // Get upcoming matches
  const { data: upcomingMatches, isLoading: isUpcomingMatchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches/upcoming"],
  });

  // Get completed matches
  const { data: completedMatches, isLoading: isCompletedMatchesLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches/completed"],
  });

  // Get team data from the API
  const { data: teams, isLoading: isTeamsLoading } = useQuery({
    queryKey: ["/api/teams"],
  });

  // Find team by ID
  const getTeamById = (id: number) => {
    return teams?.find(team => team.id === id) || { name: "Équipe inconnue", logo: "" };
  };

  // Find match by ID
  const getMatchById = (id: number) => {
    return allMatches?.find(match => match.id === id);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            À venir
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="destructive">EN DIRECT</Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Terminé
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  // Format match date
  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy, HH:mm", { locale: fr });
  };

  // Get match duration
  const getMatchDuration = (match: Match) => {
    if (match.status !== "in_progress") return null;
    
    const matchDate = new Date(match.matchDate);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - matchDate.getTime()) / (1000 * 60));
    return `${diffInMinutes} min`;
  };

  const isLoading = isAllMatchesLoading || isLiveMatchesLoading || isUpcomingMatchesLoading || isCompletedMatchesLoading || isTeamsLoading;

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Matchs</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Matchs</h1>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="live">En direct</TabsTrigger>
            <TabsTrigger value="upcoming">À venir</TabsTrigger>
            <TabsTrigger value="completed">Terminés</TabsTrigger>
          </TabsList>

          {/* All Matches Tab */}
          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                {allMatches && allMatches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Équipe Domicile</TableHead>
                          <TableHead className="text-center">Score</TableHead>
                          <TableHead>Équipe Extérieur</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allMatches.map((match) => {
                          const team1 = getTeamById(match.team1Id);
                          const team2 = getTeamById(match.team2Id);
                          
                          return (
                            <TableRow key={match.id}>
                              <TableCell className="text-sm text-gray-500">
                                {format(new Date(match.matchDate), 'd MMM, HH:mm', { locale: fr })}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 bg-gray-100 mr-2">
                                    <AvatarFallback>
                                      <Volleyball className="h-4 w-4 text-gray-400" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm font-medium text-gray-900">
                                    {team1.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {match.status === "pending" 
                                  ? "-" 
                                  : match.scoreTeam1}
                                {" : "}
                                {match.status === "pending" 
                                  ? "-" 
                                  : match.scoreTeam2}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 bg-gray-100 mr-2">
                                    <AvatarFallback>
                                      <Volleyball className="h-4 w-4 text-gray-400" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm font-medium text-gray-900">
                                    {team2.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(match.status)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-teal-700 hover:text-teal-800"
                                      onClick={() => setMatchDetailsId(match.id)}
                                    >
                                      <Search className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Détails du match</DialogTitle>
                                      <DialogDescription>
                                        Informations détaillées sur le match
                                      </DialogDescription>
                                    </DialogHeader>
                                    {matchDetailsId && (
                                      <MatchDetails 
                                        match={getMatchById(matchDetailsId)!} 
                                        team1={getTeamById(getMatchById(matchDetailsId)!.team1Id)} 
                                        team2={getTeamById(getMatchById(matchDetailsId)!.team2Id)}
                                      />
                                    )}
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">Aucun match disponible pour le moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Matches Tab */}
          <TabsContent value="live">
            {liveMatches && liveMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveMatches.map((match) => {
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
                        
                        <div className="my-3 border-t border-gray-200"></div>
                        
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="link" className="text-indigo-600 hover:text-indigo-700">
                                Voir les détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Détails du match</DialogTitle>
                                <DialogDescription>
                                  Informations détaillées sur le match
                                </DialogDescription>
                              </DialogHeader>
                              <MatchDetails match={match} team1={team1} team2={team2} />
                            </DialogContent>
                          </Dialog>
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
          </TabsContent>

          {/* Upcoming Matches Tab */}
          <TabsContent value="upcoming">
            <Card>
              <CardContent className="p-0">
                {upcomingMatches && upcomingMatches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Équipe Domicile</TableHead>
                          <TableHead className="text-center">VS</TableHead>
                          <TableHead>Équipe Extérieur</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingMatches.map((match) => {
                          const team1 = getTeamById(match.team1Id);
                          const team2 = getTeamById(match.team2Id);
                          
                          return (
                            <TableRow key={match.id}>
                              <TableCell className="text-sm text-gray-500">
                                {format(new Date(match.matchDate), 'd MMM, HH:mm', { locale: fr })}
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
                              <TableCell>
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                  À venir
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-teal-700 hover:text-teal-800"
                                    >
                                      <Search className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Détails du match</DialogTitle>
                                      <DialogDescription>
                                        Informations détaillées sur le match
                                      </DialogDescription>
                                    </DialogHeader>
                                    <MatchDetails match={match} team1={team1} team2={team2} />
                                  </DialogContent>
                                </Dialog>
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
          </TabsContent>

          {/* Completed Matches Tab */}
          <TabsContent value="completed">
            <Card>
              <CardContent className="p-0">
                {completedMatches && completedMatches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Équipe Domicile</TableHead>
                          <TableHead className="text-center">Score</TableHead>
                          <TableHead>Équipe Extérieur</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedMatches.map((match) => {
                          const team1 = getTeamById(match.team1Id);
                          const team2 = getTeamById(match.team2Id);
                          
                          return (
                            <TableRow key={match.id}>
                              <TableCell className="text-sm text-gray-500">
                                {format(new Date(match.matchDate), 'd MMM, HH:mm', { locale: fr })}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 bg-gray-100 mr-2">
                                    <AvatarFallback>
                                      <Volleyball className="h-4 w-4 text-gray-400" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={`text-sm font-medium ${match.scoreTeam1 > match.scoreTeam2 ? 'font-bold' : ''}`}>
                                    {team1.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-medium">
                                {match.scoreTeam1} : {match.scoreTeam2}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 bg-gray-100 mr-2">
                                    <AvatarFallback>
                                      <Volleyball className="h-4 w-4 text-gray-400" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className={`text-sm font-medium ${match.scoreTeam2 > match.scoreTeam1 ? 'font-bold' : ''}`}>
                                    {team2.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Terminé
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-teal-700 hover:text-teal-800"
                                    >
                                      <Search className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Détails du match</DialogTitle>
                                      <DialogDescription>
                                        Informations détaillées sur le match
                                      </DialogDescription>
                                    </DialogHeader>
                                    <MatchDetails match={match} team1={team1} team2={team2} />
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">Aucun match terminé pour le moment.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface MatchDetailsProps {
  match: Match;
  team1: any;
  team2: any;
}

const MatchDetails = ({ match, team1, team2 }: MatchDetailsProps) => {
  // Determine winner or if it's a draw
  const getMatchResult = () => {
    if (match.status !== "completed") {
      return "Match non terminé";
    }

    if (match.scoreTeam1 > match.scoreTeam2) {
      return `Victoire de ${team1.name}`;
    } else if (match.scoreTeam1 < match.scoreTeam2) {
      return `Victoire de ${team2.name}`;
    } else {
      return "Match nul";
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 text-gray-500" />
        <span className="text-sm text-gray-700">
          {formatMatchDate(match.matchDate)}
        </span>
      </div>

      <div className="p-4 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-16 w-16 bg-gray-200 mb-2">
              <AvatarFallback className="bg-gray-100">
                <Volleyball className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <p className="font-bold text-center">{team1.name}</p>
            <p className="text-xs text-gray-500">Domicile</p>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold px-4 py-2 bg-gray-100 rounded-lg flex items-center space-x-3">
              <span>{match.status === "pending" ? "-" : match.scoreTeam1}</span>
              <span className="text-gray-400">:</span>
              <span>{match.status === "pending" ? "-" : match.scoreTeam2}</span>
            </div>
            {match.status === "in_progress" && (
              <div className="mt-2 flex items-center justify-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>En direct</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <Avatar className="h-16 w-16 bg-gray-200 mb-2">
              <AvatarFallback className="bg-gray-100">
                <Volleyball className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <p className="font-bold text-center">{team2.name}</p>
            <p className="text-xs text-gray-500">Extérieur</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Statut:</span>
            <span className="text-sm font-medium">
              {match.status === "pending" 
                ? "À venir" 
                : match.status === "in_progress" 
                ? "En cours" 
                : "Terminé"}
            </span>
          </div>
          {match.status === "completed" && (
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Résultat:</span>
              <span className="text-sm font-medium">{getMatchResult()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;
