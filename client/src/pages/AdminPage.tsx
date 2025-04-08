import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  User, Shield, Users, Trophy, Calendar, Award, Edit, Trash2, 
  CheckCircle, AlertCircle, RefreshCcw, PieChart as PieChartIcon,
  BarChart as BarChartIcon, Activity, Search, Plus
} from "lucide-react";

type Match = {
  id: number;
  team1Id: number;
  team2Id: number;
  scoreTeam1: number | null;
  scoreTeam2: number | null;
  status: string;
  matchDate: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  teamId: number | null;
  statisticsId: number | null;
  dateRegistered: string;
};

type Team = {
  id: number;
  name: string;
  logo: string | null;
  captainId: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
};

type Statistics = {
  id: number;
  playerId: number;
  goalsScored: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  gamesPlayed: number;
};

const AdminPage = () => {
  const { isAdmin, isSuperAdmin, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("teams");
  
  // Redirections si l'utilisateur n'est pas admin
  useEffect(() => {
    if (!isAdmin && !isSuperAdmin) {
      window.location.href = "/";
    }
  }, [isAdmin, isSuperAdmin]);
  
  // Récupération des données
  const { data: teams, isLoading: isTeamsLoading } = useQuery({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const res = await fetch("/api/teams");
      if (!res.ok) throw new Error("Erreur lors de la récupération des équipes");
      return await res.json();
    }
  });
  
  const { data: matches, isLoading: isMatchesLoading } = useQuery({
    queryKey: ["/api/matches"],
    queryFn: async () => {
      const res = await fetch("/api/matches");
      if (!res.ok) throw new Error("Erreur lors de la récupération des matchs");
      return await res.json();
    }
  });
  
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
      return await res.json();
    }
  });
  
  const { data: allStatistics, isLoading: isStatisticsLoading } = useQuery({
    queryKey: ["/api/statistics"],
    queryFn: async () => {
      // Nous allons chercher les statistiques de chaque joueur
      if (!users) return [];
      
      const statsPromises = users.map(async (user: User) => {
        if (!user.statisticsId) return null;
        
        try {
          const res = await fetch(`/api/statistics/${user.id}`);
          if (!res.ok) return null;
          
          const stats = await res.json();
          return { ...stats, playerName: user.name, playerId: user.id };
        } catch (e) {
          return null;
        }
      });
      
      const statsResults = await Promise.all(statsPromises);
      return statsResults.filter(Boolean);
    },
    enabled: !!users
  });
  
  // États pour les formulaires et dialogs
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showStatisticsDialog, setShowStatisticsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // États pour les formulaires
  const [teamForm, setTeamForm] = useState({
    name: "",
    logo: "",
    captainId: 0
  });
  
  const [matchForm, setMatchForm] = useState({
    team1Id: 0,
    team2Id: 0,
    scoreTeam1: 0,
    scoreTeam2: 0,
    status: "UPCOMING",
    matchDate: new Date().toISOString().split('T')[0]
  });
  
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });
  
  const [statsForm, setStatsForm] = useState({
    playerId: 0,
    goalsScored: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    gamesPlayed: 0
  });
  
  // Mutations pour les opérations CRUD
  const updateTeamMutation = useMutation({
    mutationFn: async (teamData: any) => {
      const response = await apiRequest("PUT", `/api/teams/${teamData.id}`, teamData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de l'équipe");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Équipe mise à jour",
        description: "L'équipe a été mise à jour avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setShowTeamDialog(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour de l'équipe.",
      });
    }
  });
  
  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      const response = await apiRequest("DELETE", `/api/teams/${teamId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression de l'équipe");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Équipe supprimée",
        description: "L'équipe a été supprimée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la suppression de l'équipe.",
      });
    }
  });
  
  const updateMatchMutation = useMutation({
    mutationFn: async (matchData: any) => {
      const response = await apiRequest("PUT", `/api/matches/${matchData.id}`, matchData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour du match");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Match mis à jour",
        description: "Le match a été mis à jour avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setShowMatchDialog(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour du match.",
      });
    }
  });
  
  const createMatchMutation = useMutation({
    mutationFn: async (matchData: any) => {
      const response = await apiRequest("POST", "/api/matches", matchData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création du match");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Match créé",
        description: "Le match a été créé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setShowMatchDialog(false);
      // Réinitialiser le formulaire
      setMatchForm({
        team1Id: 0,
        team2Id: 0,
        scoreTeam1: 0,
        scoreTeam2: 0,
        status: "UPCOMING",
        matchDate: new Date().toISOString().split('T')[0]
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création du match.",
      });
    }
  });
  
  const deleteMatchMutation = useMutation({
    mutationFn: async (matchId: number) => {
      const response = await apiRequest("DELETE", `/api/matches/${matchId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la suppression du match");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Match supprimé",
        description: "Le match a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la suppression du match.",
      });
    }
  });
  
  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("PUT", `/api/users/${userData.id}`, userData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour de l'utilisateur");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Utilisateur mis à jour",
        description: "L'utilisateur a été mis à jour avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setShowUserDialog(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour de l'utilisateur.",
      });
    }
  });
  
  const updateStatisticsMutation = useMutation({
    mutationFn: async (statsData: any) => {
      const response = await apiRequest("PUT", `/api/statistics/${statsData.id}`, statsData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour des statistiques");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Statistiques mises à jour",
        description: "Les statistiques ont été mises à jour avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/statistics"] });
      setShowStatisticsDialog(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour des statistiques.",
      });
    }
  });
  
  // Handlers pour les actions
  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      logo: team.logo || "",
      captainId: team.captainId
    });
    setShowTeamDialog(true);
  };
  
  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);
    setMatchForm({
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      scoreTeam1: match.scoreTeam1 || 0,
      scoreTeam2: match.scoreTeam2 || 0,
      status: match.status,
      matchDate: new Date(match.matchDate).toISOString().split('T')[0]
    });
    setShowMatchDialog(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    });
    setShowUserDialog(true);
  };
  
  const handleEditStatistics = (stats: Statistics) => {
    setStatsForm({
      playerId: stats.playerId,
      goalsScored: stats.goalsScored,
      assists: stats.assists,
      yellowCards: stats.yellowCards,
      redCards: stats.redCards,
      gamesPlayed: stats.gamesPlayed
    });
    setShowStatisticsDialog(true);
  };
  
  const handleSubmitTeam = () => {
    if (!selectedTeam) return;
    
    updateTeamMutation.mutate({
      ...teamForm,
      id: selectedTeam.id
    });
  };
  
  const handleSubmitMatch = () => {
    if (selectedMatch) {
      updateMatchMutation.mutate({
        ...matchForm,
        id: selectedMatch.id
      });
    } else {
      createMatchMutation.mutate(matchForm);
    }
  };
  
  const handleSubmitUser = () => {
    if (!selectedUser) return;
    
    updateUserMutation.mutate({
      ...userForm,
      id: selectedUser.id
    });
  };
  
  const handleSubmitStatistics = () => {
    if (!statsForm.playerId) return;
    
    const userStatistics = allStatistics?.find((stats: any) => stats.playerId === statsForm.playerId);
    
    if (userStatistics) {
      updateStatisticsMutation.mutate({
        ...statsForm,
        id: userStatistics.id
      });
    }
  };
  
  const handleCreateNewMatch = () => {
    setSelectedMatch(null);
    setMatchForm({
      team1Id: 0,
      team2Id: 0,
      scoreTeam1: 0,
      scoreTeam2: 0,
      status: "UPCOMING",
      matchDate: new Date().toISOString().split('T')[0]
    });
    setShowMatchDialog(true);
  };
  
  // Fonctions auxiliaires
  const getTeamName = (teamId: number): string => {
    if (!teams) return "Équipe inconnue";
    const team = teams.find((t: Team) => t.id === teamId);
    return team ? team.name : "Équipe inconnue";
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "LIVE":
        return <Badge className="bg-green-100 text-green-800">En cours</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800">Terminé</Badge>;
      case "UPCOMING":
        return <Badge className="bg-yellow-100 text-yellow-800">À venir</Badge>;
      case "CANCELED":
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "superadmin":
        return <Badge className="bg-purple-100 text-purple-800">Super Admin</Badge>;
      case "admin":
        return <Badge className="bg-indigo-100 text-indigo-800">Administrateur</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Utilisateur</Badge>;
    }
  };
  
  // Préparation des données pour les graphiques
  const teamsChartData = teams?.map((team: Team) => ({
    name: team.name,
    points: team.points,
    matchesPlayed: team.matchesPlayed,
    wins: team.wins,
    losses: team.losses,
    draws: team.draws
  }));
  
  const topScorers = allStatistics
    ?.sort((a: any, b: any) => b.goalsScored - a.goalsScored)
    .slice(0, 10);
  
  const scorersPieData = topScorers?.reduce((acc: any[], stats: any) => {
    if (stats.goalsScored > 0) {
      acc.push({
        name: stats.playerName,
        value: stats.goalsScored
      });
    }
    return acc;
  }, []);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];
  
  // Filtrer les données en fonction du terme de recherche
  const filteredTeams = teams?.filter((team: Team) => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMatches = matches?.filter((match: Match) => {
    const team1Name = getTeamName(match.team1Id).toLowerCase();
    const team2Name = getTeamName(match.team2Id).toLowerCase();
    return (
      team1Name.includes(searchTerm.toLowerCase()) ||
      team2Name.includes(searchTerm.toLowerCase()) ||
      match.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const filteredUsers = users?.filter((user: User) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (!isAdmin && !isSuperAdmin) {
    return null;
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panneau d'Administration</h1>
          <p className="text-gray-600">Gérez les équipes, les matchs, les utilisateurs et les statistiques</p>
        </div>
        <div className="flex space-x-2">
          <Badge className="bg-indigo-100 text-indigo-800 py-1.5 px-3 text-sm">
            {isSuperAdmin ? "Super Admin" : "Admin"}
          </Badge>
          <Badge className="bg-green-100 text-green-800 py-1.5 px-3 text-sm">
            {user?.name}
          </Badge>
        </div>
      </div>
      
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-blue-100 p-3 mb-2">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="text-2xl font-bold">{users?.length || 0}</h3>
            <p className="text-gray-600">Utilisateurs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-green-100 p-3 mb-2">
              <Trophy className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-2xl font-bold">{teams?.length || 0}</h3>
            <p className="text-gray-600">Équipes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-amber-100 p-3 mb-2">
              <Calendar className="h-6 w-6 text-amber-700" />
            </div>
            <h3 className="text-2xl font-bold">{matches?.length || 0}</h3>
            <p className="text-gray-600">Matchs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-purple-100 p-3 mb-2">
              <Award className="h-6 w-6 text-purple-700" />
            </div>
            <h3 className="text-2xl font-bold">
              {topScorers && topScorers.length > 0 ? topScorers[0].goalsScored : 0}
            </h3>
            <p className="text-gray-600">Meilleur buteur</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Barre de recherche */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher par nom, email, équipe..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="teams" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Équipes
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Matchs
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>
        
        {/* Contenu des onglets */}
        
        {/* Onglet Équipes */}
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des Équipes</CardTitle>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/teams'] })}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
              <CardDescription>
                Vous pouvez consulter, modifier et supprimer des équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isTeamsLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Capitaine</TableHead>
                        <TableHead>Matchs joués</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeams && filteredTeams.length > 0 ? (
                        filteredTeams.map((team: Team) => {
                          const captain = users?.find((u: User) => u.id === team.captainId);
                          
                          return (
                            <TableRow key={team.id}>
                              <TableCell>{team.id}</TableCell>
                              <TableCell className="font-medium">{team.name}</TableCell>
                              <TableCell>{captain?.name || "Inconnu"}</TableCell>
                              <TableCell>{team.matchesPlayed}</TableCell>
                              <TableCell>{team.points}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                                    onClick={() => handleEditTeam(team)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {isSuperAdmin && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-red-50 hover:bg-red-100 text-red-600"
                                      onClick={() => deleteTeamMutation.mutate(team.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                            {searchTerm ? "Aucune équipe ne correspond à votre recherche" : "Aucune équipe trouvée"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Graphique des équipes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChartIcon className="h-5 w-5 mr-2" />
                Performance des Équipes
              </CardTitle>
              <CardDescription>
                Statistiques comparatives de toutes les équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={teamsChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="points" name="Points" fill="#8884d8" />
                    <Bar dataKey="wins" name="Victoires" fill="#82ca9d" />
                    <Bar dataKey="losses" name="Défaites" fill="#ff8042" />
                    <Bar dataKey="draws" name="Nuls" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
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
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCreateNewMatch}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Match
                  </Button>
                  <Button 
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/matches'] })}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
              <CardDescription>
                Vous pouvez créer, modifier et supprimer des matchs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMatchesLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Équipes</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMatches && filteredMatches.length > 0 ? (
                        filteredMatches.map((match: Match) => (
                          <TableRow key={match.id}>
                            <TableCell>{match.id}</TableCell>
                            <TableCell>
                              {getTeamName(match.team1Id)} vs {getTeamName(match.team2Id)}
                            </TableCell>
                            <TableCell>
                              {match.scoreTeam1 !== null && match.scoreTeam2 !== null
                                ? `${match.scoreTeam1} - ${match.scoreTeam2}`
                                : "Non joué"}
                            </TableCell>
                            <TableCell>{getStatusBadge(match.status)}</TableCell>
                            <TableCell>
                              {new Date(match.matchDate).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                                  onClick={() => handleEditMatch(match)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {isSuperAdmin && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-600"
                                    onClick={() => deleteMatchMutation.mutate(match.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                            {searchTerm ? "Aucun match ne correspond à votre recherche" : "Aucun match trouvé"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Statistiques des matchs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-3 mb-2">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold">
                  {matches?.filter((m: Match) => m.status === "COMPLETED").length || 0}
                </h3>
                <p className="text-gray-600">Matchs Terminés</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-amber-100 p-3 mb-2">
                  <AlertCircle className="h-6 w-6 text-amber-700" />
                </div>
                <h3 className="text-2xl font-bold">
                  {matches?.filter((m: Match) => m.status === "LIVE").length || 0}
                </h3>
                <p className="text-gray-600">Matchs En Cours</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="rounded-full bg-blue-100 p-3 mb-2">
                  <Calendar className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="text-2xl font-bold">
                  {matches?.filter((m: Match) => m.status === "UPCOMING").length || 0}
                </h3>
                <p className="text-gray-600">Matchs À Venir</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Onglet Utilisateurs */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/users'] })}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
              <CardDescription>
                Vous pouvez consulter et modifier les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isUsersLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Équipe</TableHead>
                        <TableHead>Date d'inscription</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers && filteredUsers.length > 0 ? (
                        filteredUsers.map((user: User) => {
                          const userTeam = teams?.find((t: Team) => t.id === user.teamId);
                          
                          return (
                            <TableRow key={user.id}>
                              <TableCell>{user.id}</TableCell>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{getRoleBadge(user.role)}</TableCell>
                              <TableCell>{userTeam ? userTeam.name : "Aucune"}</TableCell>
                              <TableCell>
                                {new Date(user.dateRegistered).toLocaleDateString("fr-FR")}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-purple-50 hover:bg-purple-100 text-purple-600"
                                    onClick={() => {
                                      const userStats = allStatistics?.find((s: any) => s.playerId === user.id);
                                      if (userStats) {
                                        handleEditStatistics(userStats);
                                      } else {
                                        toast({
                                          title: "Aucune statistique",
                                          description: "Cet utilisateur n'a pas encore de statistiques.",
                                          variant: "destructive"
                                        });
                                      }
                                    }}
                                  >
                                    <Activity className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                            {searchTerm ? "Aucun utilisateur ne correspond à votre recherche" : "Aucun utilisateur trouvé"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Répartition des rôles */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Répartition des Rôles
              </CardTitle>
              <CardDescription>
                Distribution des utilisateurs par rôle dans l'application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="rounded-full bg-gray-100 p-3 mb-2">
                      <User className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {users?.filter((u: User) => u.role === "user").length || 0}
                    </h3>
                    <p className="text-gray-600">Utilisateurs</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="rounded-full bg-indigo-100 p-3 mb-2">
                      <Shield className="h-6 w-6 text-indigo-700" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {users?.filter((u: User) => u.role === "admin").length || 0}
                    </h3>
                    <p className="text-gray-600">Administrateurs</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="rounded-full bg-purple-100 p-3 mb-2">
                      <Shield className="h-6 w-6 text-purple-700" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      {users?.filter((u: User) => u.role === "superadmin").length || 0}
                    </h3>
                    <p className="text-gray-600">Super Admins</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Onglet Statistiques */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Statistiques des Joueurs</CardTitle>
                <Button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/statistics'] })}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>
              <CardDescription>
                Consultez et modifiez les statistiques des joueurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isStatisticsLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Joueur</TableHead>
                        <TableHead>Équipe</TableHead>
                        <TableHead>Buts</TableHead>
                        <TableHead>Passes</TableHead>
                        <TableHead>Cartons Jaunes</TableHead>
                        <TableHead>Cartons Rouges</TableHead>
                        <TableHead>Matchs Joués</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allStatistics && allStatistics.length > 0 ? (
                        allStatistics.map((stats: any) => {
                          const player = users?.find((u: User) => u.id === stats.playerId);
                          const playerTeam = teams?.find((t: Team) => t.id === player?.teamId);
                          
                          if (!player) return null;
                          
                          return (
                            <TableRow key={stats.id}>
                              <TableCell className="font-medium">{player.name}</TableCell>
                              <TableCell>{playerTeam ? playerTeam.name : "Aucune"}</TableCell>
                              <TableCell>{stats.goalsScored}</TableCell>
                              <TableCell>{stats.assists}</TableCell>
                              <TableCell>{stats.yellowCards}</TableCell>
                              <TableCell>{stats.redCards}</TableCell>
                              <TableCell>{stats.gamesPlayed}</TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                                  onClick={() => handleEditStatistics(stats)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                            Aucune statistique trouvée
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Graphiques de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChartIcon className="h-5 w-5 mr-2" />
                  Classement des Buteurs
                </CardTitle>
                <CardDescription>
                  Top 10 des meilleurs buteurs du tournoi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topScorers}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="playerName" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="goalsScored" name="Buts" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Répartition des Buts
                </CardTitle>
                <CardDescription>
                  Distribution des buts par joueur
                </CardDescription>
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
                        {scorersPieData?.map((entry, index) => (
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
      </Tabs>
      
      {/* Dialogs pour les formulaires */}
      
      {/* Dialog Équipe */}
      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier l'équipe</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'équipe
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teamName" className="text-right">
                Nom
              </Label>
              <Input
                id="teamName"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teamLogo" className="text-right">
                Logo URL
              </Label>
              <Input
                id="teamLogo"
                value={teamForm.logo || ""}
                onChange={(e) => setTeamForm({ ...teamForm, logo: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="captainId" className="text-right">
                Capitaine
              </Label>
              <Select
                value={teamForm.captainId.toString()}
                onValueChange={(value) => setTeamForm({ ...teamForm, captainId: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un capitaine" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user: User) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitTeam}
              disabled={updateTeamMutation.isPending}
            >
              {updateTeamMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Match */}
      <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMatch ? "Modifier le match" : "Créer un nouveau match"}
            </DialogTitle>
            <DialogDescription>
              {selectedMatch 
                ? "Modifier les informations du match" 
                : "Créer un nouveau match en remplissant les informations ci-dessous"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team1Id" className="text-right">
                Équipe 1
              </Label>
              <Select
                value={matchForm.team1Id.toString()}
                onValueChange={(value) => setMatchForm({ ...matchForm, team1Id: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez l'équipe 1" />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team2Id" className="text-right">
                Équipe 2
              </Label>
              <Select
                value={matchForm.team2Id.toString()}
                onValueChange={(value) => setMatchForm({ ...matchForm, team2Id: parseInt(value) })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez l'équipe 2" />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team: Team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scoreTeam1" className="text-right">
                Score Équipe 1
              </Label>
              <Input
                id="scoreTeam1"
                type="number"
                value={matchForm.scoreTeam1}
                onChange={(e) => setMatchForm({ ...matchForm, scoreTeam1: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="scoreTeam2" className="text-right">
                Score Équipe 2
              </Label>
              <Input
                id="scoreTeam2"
                type="number"
                value={matchForm.scoreTeam2}
                onChange={(e) => setMatchForm({ ...matchForm, scoreTeam2: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={matchForm.status}
                onValueChange={(value) => setMatchForm({ ...matchForm, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">À venir</SelectItem>
                  <SelectItem value="LIVE">En cours</SelectItem>
                  <SelectItem value="COMPLETED">Terminé</SelectItem>
                  <SelectItem value="CANCELED">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="matchDate" className="text-right">
                Date du match
              </Label>
              <Input
                id="matchDate"
                type="date"
                value={matchForm.matchDate}
                onChange={(e) => setMatchForm({ ...matchForm, matchDate: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMatchDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitMatch}
              disabled={updateMatchMutation.isPending || createMatchMutation.isPending}
            >
              {updateMatchMutation.isPending || createMatchMutation.isPending 
                ? "Enregistrement..." 
                : "Enregistrer"
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Utilisateur */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userName" className="text-right">
                Nom
              </Label>
              <Input
                id="userName"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userEmail" className="text-right">
                Email
              </Label>
              <Input
                id="userEmail"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userPassword" className="text-right">
                Mot de passe
              </Label>
              <Input
                id="userPassword"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                placeholder="Laisser vide pour ne pas modifier"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userRole" className="text-right">
                Rôle
              </Label>
              <Select
                value={userForm.role}
                onValueChange={(value) => setUserForm({ ...userForm, role: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Utilisateur</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  {isSuperAdmin && (
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUserDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitUser}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog Statistiques */}
      <Dialog open={showStatisticsDialog} onOpenChange={setShowStatisticsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier les statistiques</DialogTitle>
            <DialogDescription>
              Modifier les statistiques du joueur
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goalsScored" className="text-right">
                Buts
              </Label>
              <Input
                id="goalsScored"
                type="number"
                value={statsForm.goalsScored}
                onChange={(e) => setStatsForm({ ...statsForm, goalsScored: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assists" className="text-right">
                Passes
              </Label>
              <Input
                id="assists"
                type="number"
                value={statsForm.assists}
                onChange={(e) => setStatsForm({ ...statsForm, assists: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="yellowCards" className="text-right">
                Cartons Jaunes
              </Label>
              <Input
                id="yellowCards"
                type="number"
                value={statsForm.yellowCards}
                onChange={(e) => setStatsForm({ ...statsForm, yellowCards: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="redCards" className="text-right">
                Cartons Rouges
              </Label>
              <Input
                id="redCards"
                type="number"
                value={statsForm.redCards}
                onChange={(e) => setStatsForm({ ...statsForm, redCards: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gamesPlayed" className="text-right">
                Matchs Joués
              </Label>
              <Input
                id="gamesPlayed"
                type="number"
                value={statsForm.gamesPlayed}
                onChange={(e) => setStatsForm({ ...statsForm, gamesPlayed: parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatisticsDialog(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmitStatistics}
              disabled={updateStatisticsMutation.isPending}
            >
              {updateStatisticsMutation.isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;