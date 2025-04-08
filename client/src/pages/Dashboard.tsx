import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import PlayerStats from "@/components/PlayerStats";
import TeamManagement from "@/components/TeamManagement";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Volleyball, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Dashboard = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const { data: matches } = useQuery({
    queryKey: ["/api/matches/upcoming"],
    enabled: isAuthenticated,
  });

  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
    enabled: isAuthenticated,
  });

  // Get user team
  const userTeam = teams?.find(team => team.id === user?.teamId);

  // Filter matches for user's team
  const userMatches = matches?.filter(
    match => match.team1Id === user?.teamId || match.team2Id === user?.teamId
  );

  // Get team name by ID
  const getTeamName = (teamId: number) => {
    return teams?.find(team => team.id === teamId)?.name || "Équipe inconnue";
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
        
        {/* Player Info Card */}
        <Card className="mb-6">
          <CardContent className="px-4 py-5 sm:p-6">
            <div className="bg-teal-700 -m-6 mb-6 px-6 py-5 rounded-t-lg">
              <h2 className="text-lg leading-6 font-medium text-white">Informations du joueur</h2>
              <p className="mt-1 max-w-2xl text-sm text-teal-300">Détails personnels et statistiques</p>
            </div>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Équipe</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {userTeam ? userTeam.name : "Aucune équipe"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Rôle dans l'équipe</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {userTeam && userTeam.captainId === user?.id ? "Capitaine" : "Joueur"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        {/* Player Stats */}
        <PlayerStats />
        
        {/* Team Management (if player is admin/captain) */}
        {user?.role === "admin" && <TeamManagement />}
        
        {/* Upcoming Matches */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mes prochains matchs</h2>
          <Card>
            <CardContent className="p-0">
              {userMatches && userMatches.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Adversaire</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userMatches.map(match => {
                      const isTeam1 = match.team1Id === user?.teamId;
                      const opponentId = isTeam1 ? match.team2Id : match.team1Id;
                      const opponentName = getTeamName(opponentId);
                      const matchDate = new Date(match.matchDate);
                      
                      return (
                        <TableRow key={match.id}>
                          <TableCell className="text-sm text-gray-500">
                            {format(matchDate, "d MMM, HH:mm", { locale: fr })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 bg-gray-100 mr-4">
                                <AvatarFallback>
                                  <Volleyball className="h-5 w-5 text-gray-400" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium text-gray-900">
                                {opponentName}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              À venir
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="link" className="text-teal-700 hover:text-teal-800">
                              Détails
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Aucun match à venir pour le moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
