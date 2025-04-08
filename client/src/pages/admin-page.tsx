import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

// Définition des types
interface Team {
  id: number;
  name: string;
  logo: string | null;
  captainId: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  teamId: number | null;
  statisticsId: number | null;
  dateRegistered: string;
}

interface Match {
  id: number;
  team1Id: number;
  team2Id: number;
  scoreTeam1: number | null;
  scoreTeam2: number | null;
  status: string;
  matchDate: string;
}

interface Statistics {
  id: number;
  playerId: number;
  goalsScored: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  gamesPlayed: number;
}
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";

const COLORS = [
  "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c",
  "#d0ed57", "#ffc658", "#ff8c42", "#ff5252", "#ff4081"
];

const AdminPage = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Redirection si l'utilisateur n'est pas administrateur
  useEffect(() => {
    if (user && !isAdmin && !isSuperAdmin) {
      navigate("/dashboard");
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page",
        variant: "destructive",
      });
    }
  }, [user, isAdmin, isSuperAdmin, navigate, toast]);

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    enabled: isAdmin || isSuperAdmin,
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: isAdmin || isSuperAdmin,
  });

  const { data: matches = [] } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
    enabled: isAdmin || isSuperAdmin,
  });

  const { data: statistics = [] } = useQuery<Statistics[]>({
    queryKey: ["/api/statistics"],
    enabled: isAdmin || isSuperAdmin,
  });

  // Si les données ne sont pas encore chargées ou si l'utilisateur n'est pas admin
  if (!teams || !users || !matches || !user || (!isAdmin && !isSuperAdmin)) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  // Préparation des données pour les graphiques
  const teamsChartData = teams.map((team) => ({
    name: team.name,
    wins: team.wins,
    losses: team.losses,
    draws: team.draws,
    points: team.points,
  }));

  const matchesStatusData = [
    { name: "Complétés", value: matches.filter(m => m.status === "COMPLETED").length },
    { name: "En direct", value: matches.filter(m => m.status === "LIVE").length },
    { name: "À venir", value: matches.filter(m => m.status === "UPCOMING").length },
  ];

  const userRolesData = [
    { name: "Utilisateurs", value: users.filter(u => u.role === "user").length },
    { name: "Admins", value: users.filter(u => u.role === "admin").length },
    { name: "Super Admins", value: users.filter(u => u.role === "superadmin").length },
  ];

  // Données pour les meilleurs buteurs (top 5)
  const sortedStatistics = [...statistics].sort((a, b) => b.goalsScored - a.goalsScored).slice(0, 5);
  const scorersPieData = sortedStatistics.map(stat => {
    const player = users.find(u => u.id === stat.playerId);
    return {
      name: player ? player.name : `Joueur #${stat.playerId}`,
      value: stat.goalsScored
    };
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panneau d'Administration</h1>
        <Button onClick={() => navigate("/dashboard")}>
          Retour au tableau de bord
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 h-auto">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="matches">Matchs</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        {/* Onglet Aperçu */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Équipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Matchs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{matches.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Matchs Aujourd'hui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {matches.filter(
                    m => new Date(m.matchDate).toDateString() === new Date().toDateString()
                  ).length}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance des Équipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={teamsChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="wins" fill="#82ca9d" name="Victoires" />
                      <Bar dataKey="losses" fill="#ff8042" name="Défaites" />
                      <Bar dataKey="draws" fill="#8884d8" name="Nuls" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statut des Matchs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={matchesStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {matchesStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Rôles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRolesData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {userRolesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meilleurs Buteurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scorersPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {scorersPieData?.map((entry: {name: string, value: number}, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Équipes */}
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des Équipes</CardTitle>
                <Button>Nouvelle Équipe</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-100">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-6 py-3">Capitaine</th>
                      <th className="px-6 py-3">Matchs Joués</th>
                      <th className="px-6 py-3">V/D/N</th>
                      <th className="px-6 py-3">Points</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => {
                      const captain = users?.find((u) => u.id === team.captainId);
                      return (
                        <tr key={team.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{team.id}</td>
                          <td className="px-6 py-4 font-medium">{team.name}</td>
                          <td className="px-6 py-4">{captain ? captain.name : "N/A"}</td>
                          <td className="px-6 py-4">{team.matchesPlayed}</td>
                          <td className="px-6 py-4">{team.wins}/{team.losses}/{team.draws}</td>
                          <td className="px-6 py-4">{team.points}</td>
                          <td className="px-6 py-4 flex space-x-2">
                            <Button variant="outline" size="sm">Modifier</Button>
                            {isSuperAdmin && (
                              <Button variant="destructive" size="sm">Supprimer</Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Matchs */}
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des Matchs</CardTitle>
                <Button>Nouveau Match</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-100">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Équipe 1</th>
                      <th className="px-6 py-3">Équipe 2</th>
                      <th className="px-6 py-3">Score</th>
                      <th className="px-6 py-3">Statut</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match) => {
                      const team1 = teams.find(t => t.id === match.team1Id);
                      const team2 = teams.find(t => t.id === match.team2Id);
                      return (
                        <tr key={match.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{match.id}</td>
                          <td className="px-6 py-4">{team1 ? team1.name : "Équipe inconnue"}</td>
                          <td className="px-6 py-4">{team2 ? team2.name : "Équipe inconnue"}</td>
                          <td className="px-6 py-4">
                            {match.scoreTeam1 !== null && match.scoreTeam2 !== null
                              ? `${match.scoreTeam1} - ${match.scoreTeam2}`
                              : "Non joué"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              match.status === "LIVE" ? "bg-green-100 text-green-800" :
                              match.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {match.status === "LIVE" ? "En direct" :
                               match.status === "COMPLETED" ? "Terminé" :
                               match.status === "CANCELED" ? "Annulé" : "À venir"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(match.matchDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex space-x-2">
                            <Button variant="outline" size="sm">Modifier</Button>
                            {isSuperAdmin && (
                              <Button variant="destructive" size="sm">Supprimer</Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Utilisateurs */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des Utilisateurs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-100">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Rôle</th>
                      <th className="px-6 py-3">Équipe</th>
                      <th className="px-6 py-3">Date d'inscription</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const userTeam = teams.find(t => t.id === user.teamId);
                      return (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{user.id}</td>
                          <td className="px-6 py-4 font-medium">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === "superadmin" ? "bg-red-100 text-red-800" :
                              user.role === "admin" ? "bg-blue-100 text-blue-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {user.role === "superadmin" ? "Super Admin" :
                              user.role === "admin" ? "Admin" : "Utilisateur"}
                            </span>
                          </td>
                          <td className="px-6 py-4">{userTeam ? userTeam.name : "Aucune"}</td>
                          <td className="px-6 py-4">
                            {new Date(user.dateRegistered).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex space-x-2">
                            <Button variant="outline" size="sm">Modifier</Button>
                            <Button variant="outline" size="sm">Stats</Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;