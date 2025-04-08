import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Users,
  UserPlus,
  Volleyball,
  Calendar,
  PenSquare,
  Trash2,
  Shield,
  User,
  Check,
  X,
} from "lucide-react";

interface MatchFormData {
  team1Id: number;
  team2Id: number;
  matchDate: string;
  status: string;
  scoreTeam1?: number;
  scoreTeam2?: number;
}

interface TeamFormData {
  name: string;
  logo: string;
  captainId?: number;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const AdminPanel = () => {
  const { isAuthenticated, isSuperAdmin, isAdmin, user, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for forms
  const [matchForm, setMatchForm] = useState<MatchFormData>({
    team1Id: 0,
    team2Id: 0,
    matchDate: "",
    status: "pending",
    scoreTeam1: 0,
    scoreTeam2: 0,
  });

  const [teamForm, setTeamForm] = useState<TeamFormData>({
    name: "",
    logo: "",
    captainId: undefined,
  });

  const [userForm, setUserForm] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "player",
  });

  const [matchToEdit, setMatchToEdit] = useState<number | null>(null);
  const [teamToEdit, setTeamToEdit] = useState<number | null>(null);

  // Dialog states
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/dashboard");
      toast({
        variant: "destructive",
        title: "Accès refusé",
        description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
      });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate, toast]);

  // Queries
  const { data: teams } = useQuery({
    queryKey: ["/api/teams"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: matches } = useQuery({
    queryKey: ["/api/matches"],
    enabled: isAuthenticated && isAdmin,
  });

  const { data: users } = useQuery({
    queryKey: ["/api/users"],
    enabled: isAuthenticated && isSuperAdmin,
  });

  // Mutations
  const createMatchMutation = useMutation({
    mutationFn: (matchData: MatchFormData) => {
      return apiRequest("POST", "/api/matches", matchData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setMatchDialogOpen(false);
      resetMatchForm();
      toast({
        title: "Match créé",
        description: "Le match a été créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création du match",
      });
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MatchFormData> }) => {
      return apiRequest("PUT", `/api/matches/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setMatchDialogOpen(false);
      resetMatchForm();
      setMatchToEdit(null);
      toast({
        title: "Match mis à jour",
        description: "Le match a été mis à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour du match",
      });
    },
  });

  const deleteMatchMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/matches/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({
        title: "Match supprimé",
        description: "Le match a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la suppression du match",
      });
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: (teamData: TeamFormData) => {
      return apiRequest("POST", "/api/teams", teamData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setTeamDialogOpen(false);
      resetTeamForm();
      toast({
        title: "Équipe créée",
        description: "L'équipe a été créée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de l'équipe",
      });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TeamFormData> }) => {
      return apiRequest("PUT", `/api/teams/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      setTeamDialogOpen(false);
      resetTeamForm();
      setTeamToEdit(null);
      toast({
        title: "Équipe mise à jour",
        description: "L'équipe a été mise à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la mise à jour de l'équipe",
      });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/teams/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Équipe supprimée",
        description: "L'équipe a été supprimée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la suppression de l'équipe",
      });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: UserFormData) => {
      return apiRequest("POST", "/api/auth/register", userData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setUserDialogOpen(false);
      resetUserForm();
      toast({
        title: "Utilisateur créé",
        description: "L'utilisateur a été créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de l'utilisateur",
      });
    },
  });

  // Helper functions
  const resetMatchForm = () => {
    setMatchForm({
      team1Id: 0,
      team2Id: 0,
      matchDate: "",
      status: "pending",
      scoreTeam1: 0,
      scoreTeam2: 0,
    });
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: "",
      logo: "",
      captainId: undefined,
    });
  };

  const resetUserForm = () => {
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "player",
    });
  };

  const handleEditMatch = (match: any) => {
    setMatchToEdit(match.id);
    const localDate = new Date(match.matchDate).toISOString().slice(0, 16);
    setMatchForm({
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      matchDate: localDate,
      status: match.status,
      scoreTeam1: match.scoreTeam1,
      scoreTeam2: match.scoreTeam2,
    });
    setMatchDialogOpen(true);
  };

  const handleEditTeam = (team: any) => {
    setTeamToEdit(team.id);
    setTeamForm({
      name: team.name,
      logo: team.logo || "",
      captainId: team.captainId,
    });
    setTeamDialogOpen(true);
  };

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (matchForm.team1Id === matchForm.team2Id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une équipe ne peut pas jouer contre elle-même",
      });
      return;
    }

    if (matchToEdit) {
      updateMatchMutation.mutate({
        id: matchToEdit,
        data: matchForm,
      });
    } else {
      createMatchMutation.mutate(matchForm);
    }
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();

    if (teamToEdit) {
      updateTeamMutation.mutate({
        id: teamToEdit,
        data: teamForm,
      });
    } else {
      createTeamMutation.mutate(teamForm);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(userForm);
  };

  // Get team name by ID
  const getTeamName = (id: number) => {
    const team = teams?.find((team) => team.id === id);
    return team ? team.name : "Équipe inconnue";
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

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel d'administration</h1>
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel d'administration</h1>
        
        <Card className="mb-8">
          <CardContent className="p-0">
            <div className="px-4 py-5 sm:px-6 bg-indigo-600">
              <h2 className="text-lg leading-6 font-medium text-white">Administration du tournoi</h2>
              <p className="mt-1 max-w-2xl text-sm text-indigo-200">Gérez tous les aspects du tournoi</p>
            </div>
            
            <div className="border-t border-gray-200 p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="block border-b md:border-b-0 md:border-r border-gray-200 p-6 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Gestion des équipes</p>
                      <p className="text-sm text-gray-500">Ajouter, modifier ou supprimer des équipes</p>
                    </div>
                  </div>
                </div>
                
                <div className="block border-b md:border-b-0 md:border-r border-gray-200 p-6 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Gestion des joueurs</p>
                      <p className="text-sm text-gray-500">Ajouter, modifier ou supprimer des joueurs</p>
                    </div>
                  </div>
                </div>
                
                <div className="block p-6 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-medium text-gray-900">Gestion des matchs</p>
                      <p className="text-sm text-gray-500">Planifier, mettre à jour les scores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="matches" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="matches">Matchs</TabsTrigger>
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="users">Utilisateurs</TabsTrigger>}
          </TabsList>
          
          {/* Matches Tab */}
          <TabsContent value="matches">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Gestion des matchs</h2>
              <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => {
                    resetMatchForm();
                    setMatchToEdit(null);
                  }}>
                    Ajouter un match
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{matchToEdit ? "Modifier le match" : "Ajouter un match"}</DialogTitle>
                    <DialogDescription>
                      {matchToEdit 
                        ? "Modifiez les détails du match" 
                        : "Remplissez les détails pour créer un nouveau match"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateMatch}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team1" className="text-right">
                          Équipe domicile
                        </Label>
                        <select
                          id="team1"
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={matchForm.team1Id}
                          onChange={(e) => setMatchForm({
                            ...matchForm,
                            team1Id: parseInt(e.target.value),
                          })}
                          required
                        >
                          <option value="0">Sélectionnez une équipe</option>
                          {teams?.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team2" className="text-right">
                          Équipe extérieur
                        </Label>
                        <select
                          id="team2"
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={matchForm.team2Id}
                          onChange={(e) => setMatchForm({
                            ...matchForm,
                            team2Id: parseInt(e.target.value),
                          })}
                          required
                        >
                          <option value="0">Sélectionnez une équipe</option>
                          {teams?.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                          Date et heure
                        </Label>
                        <Input
                          id="date"
                          type="datetime-local"
                          className="col-span-3"
                          value={matchForm.matchDate}
                          onChange={(e) => setMatchForm({
                            ...matchForm,
                            matchDate: e.target.value,
                          })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Statut
                        </Label>
                        <select
                          id="status"
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={matchForm.status}
                          onChange={(e) => setMatchForm({
                            ...matchForm,
                            status: e.target.value,
                          })}
                          required
                        >
                          <option value="pending">À venir</option>
                          <option value="in_progress">En cours</option>
                          <option value="completed">Terminé</option>
                        </select>
                      </div>
                      {matchForm.status !== "pending" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="scoreTeam1" className="text-right">
                              Score équipe 1
                            </Label>
                            <Input
                              id="scoreTeam1"
                              type="number"
                              min="0"
                              className="col-span-3"
                              value={matchForm.scoreTeam1}
                              onChange={(e) => setMatchForm({
                                ...matchForm,
                                scoreTeam1: parseInt(e.target.value),
                              })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="scoreTeam2" className="text-right">
                              Score équipe 2
                            </Label>
                            <Input
                              id="scoreTeam2"
                              type="number"
                              min="0"
                              className="col-span-3"
                              value={matchForm.scoreTeam2}
                              onChange={(e) => setMatchForm({
                                ...matchForm,
                                scoreTeam2: parseInt(e.target.value),
                              })}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-teal-700 hover:bg-teal-800"
                        disabled={createMatchMutation.isPending || updateMatchMutation.isPending}
                      >
                        {matchToEdit ? "Mettre à jour" : "Créer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {matches && matches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Équipes</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {matches.map((match) => (
                          <TableRow key={match.id}>
                            <TableCell className="text-sm text-gray-500">
                              M{String(match.id).padStart(3, '0')}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-900">
                                {getTeamName(match.team1Id)} vs {getTeamName(match.team2Id)}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              {format(new Date(match.matchDate), 'd MMM, HH:mm', { locale: fr })}
                            </TableCell>
                            <TableCell className="text-sm text-gray-900">
                              {match.status === "pending" ? "- : -" : `${match.scoreTeam1} : ${match.scoreTeam2}`}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(match.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-teal-700 hover:text-teal-800 mr-2"
                                onClick={() => handleEditMatch(match)}
                              >
                                <PenSquare className="h-4 w-4" />
                              </Button>
                              
                              {isSuperAdmin && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce match?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Cette action est irréversible. Le match sera définitivement supprimé.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={() => deleteMatchMutation.mutate(match.id)}
                                      >
                                        Supprimer
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
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
          
          {/* Teams Tab */}
          <TabsContent value="teams">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Gestion des équipes</h2>
              <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => {
                    resetTeamForm();
                    setTeamToEdit(null);
                  }}>
                    Ajouter une équipe
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{teamToEdit ? "Modifier l'équipe" : "Ajouter une équipe"}</DialogTitle>
                    <DialogDescription>
                      {teamToEdit 
                        ? "Modifiez les détails de l'équipe" 
                        : "Remplissez les détails pour créer une nouvelle équipe"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTeam}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="teamName" className="text-right">
                          Nom de l'équipe
                        </Label>
                        <Input
                          id="teamName"
                          className="col-span-3"
                          value={teamForm.name}
                          onChange={(e) => setTeamForm({
                            ...teamForm,
                            name: e.target.value,
                          })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="logo" className="text-right">
                          Logo (URL)
                        </Label>
                        <Input
                          id="logo"
                          type="url"
                          placeholder="https://example.com/logo.png"
                          className="col-span-3"
                          value={teamForm.logo}
                          onChange={(e) => setTeamForm({
                            ...teamForm,
                            logo: e.target.value,
                          })}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="captain" className="text-right">
                          Capitaine
                        </Label>
                        <select
                          id="captain"
                          className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={teamForm.captainId || ""}
                          onChange={(e) => setTeamForm({
                            ...teamForm,
                            captainId: e.target.value ? parseInt(e.target.value) : undefined,
                          })}
                        >
                          <option value="">Sélectionnez un capitaine</option>
                          {users?.filter(u => u.role === "player" || u.role === "admin").map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        className="bg-teal-700 hover:bg-teal-800"
                        disabled={createTeamMutation.isPending || updateTeamMutation.isPending}
                      >
                        {teamToEdit ? "Mettre à jour" : "Créer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <Card>
              <CardContent className="p-0">
                {teams && teams.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Équipe</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Matchs joués</TableHead>
                          <TableHead>Capitaine</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teams.map((team) => {
                          const captain = users?.find(u => u.id === team.captainId);
                          
                          return (
                            <TableRow key={team.id}>
                              <TableCell>
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10 bg-gray-100 mr-4">
                                    <AvatarFallback className="bg-gray-100">
                                      <Volleyball className="h-5 w-5 text-gray-400" />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm font-medium text-gray-900">
                                    {team.name}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{team.points}</TableCell>
                              <TableCell>{team.matchesPlayed}</TableCell>
                              <TableCell>
                                {captain ? captain.name : "Non défini"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-teal-700 hover:text-teal-800 mr-2"
                                  onClick={() => handleEditTeam(team)}
                                >
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                                
                                {isSuperAdmin && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette équipe?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Cette action est irréversible. L'équipe sera définitivement supprimée.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-red-600 hover:bg-red-700"
                                          onClick={() => deleteTeamMutation.mutate(team.id)}
                                        >
                                          Supprimer
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
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
          </TabsContent>
          
          {/* Users Tab (SuperAdmin only) */}
          {isSuperAdmin && (
            <TabsContent value="users">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Gestion des utilisateurs</h2>
                <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Ajouter un utilisateur
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Ajouter un utilisateur</DialogTitle>
                      <DialogDescription>
                        Créez un nouvel utilisateur pour le tournoi
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateUser}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="userName" className="text-right">
                            Nom complet
                          </Label>
                          <Input
                            id="userName"
                            className="col-span-3"
                            value={userForm.name}
                            onChange={(e) => setUserForm({
                              ...userForm,
                              name: e.target.value,
                            })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="userEmail" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="userEmail"
                            type="email"
                            className="col-span-3"
                            value={userForm.email}
                            onChange={(e) => setUserForm({
                              ...userForm,
                              email: e.target.value,
                            })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="userPassword" className="text-right">
                            Mot de passe
                          </Label>
                          <Input
                            id="userPassword"
                            type="password"
                            className="col-span-3"
                            value={userForm.password}
                            onChange={(e) => setUserForm({
                              ...userForm,
                              password: e.target.value,
                            })}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="userRole" className="text-right">
                            Rôle
                          </Label>
                          <select
                            id="userRole"
                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={userForm.role}
                            onChange={(e) => setUserForm({
                              ...userForm,
                              role: e.target.value,
                            })}
                            required
                          >
                            <option value="player">Joueur</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Super Admin</option>
                          </select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="bg-teal-700 hover:bg-teal-800"
                          disabled={createUserMutation.isPending}
                        >
                          Créer
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  {users && users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Équipe</TableHead>
                            <TableHead>Date d'inscription</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => {
                            const userTeam = teams?.find(t => t.id === user.teamId);
                            
                            return (
                              <TableRow key={user.id}>
                                <TableCell>
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8 mr-3">
                                      <AvatarFallback className={
                                        user.role === "superadmin"
                                          ? "bg-red-100 text-red-600"
                                          : user.role === "admin"
                                          ? "bg-indigo-100 text-indigo-600"
                                          : "bg-teal-100 text-teal-600"
                                      }>
                                        {user.role === "superadmin" ? (
                                          <Shield className="h-4 w-4" />
                                        ) : (
                                          <User className="h-4 w-4" />
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm font-medium text-gray-900">
                                      {user.name}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                  {user.email}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={
                                    user.role === "superadmin"
                                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                                      : user.role === "admin"
                                      ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                                      : "bg-teal-100 text-teal-800 hover:bg-teal-100"
                                  }>
                                    {user.role === "superadmin" 
                                      ? "Super Admin" 
                                      : user.role === "admin" 
                                      ? "Admin" 
                                      : "Joueur"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {userTeam ? userTeam.name : "Aucune équipe"}
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                  {format(new Date(user.dateRegistered), 'd MMM yyyy', { locale: fr })}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">Aucun utilisateur disponible pour le moment.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
