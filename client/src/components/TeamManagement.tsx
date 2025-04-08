import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Team, User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { User as UserIcon, Volleyball, PlusCircle } from "lucide-react";

const TeamManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPlayerId, setNewPlayerId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);

  // Get user's team
  const { data: team, isLoading: isTeamLoading } = useQuery<Team>({
    queryKey: [`/api/teams/${user?.teamId}`],
    enabled: !!user?.teamId,
  });

  // Get users
  const { data: allUsers } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!team,
  });

  // Find team members based on players array
  const teamMembers = allUsers?.filter(u => 
    team?.players && Array.isArray(team.players) && 
    team.players.includes(u.id)
  );

  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: (teamData: { name: string }) => {
      return apiRequest(
        "POST",
        "/api/teams",
        { 
          name: teamData.name,
          logo: null,
          captainId: user?.id, 
          players: [user?.id]
        }
      );
    },
    onSuccess: (data) => {
      toast({
        title: "Équipe créée",
        description: "Votre équipe a été créée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      setShowCreateTeamDialog(false);
      setTeamName("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de l'équipe.",
      });
    }
  });

  // Add player to team mutation
  const addPlayerMutation = useMutation({
    mutationFn: async (playerId: number) => {
      if (!team) throw new Error("No team found");
      
      const players = Array.isArray(team.players) ? [...team.players, playerId] : [playerId];
      
      return apiRequest(
        "PUT", 
        `/api/teams/${team.id}`, 
        { players }
      );
    },
    onSuccess: () => {
      toast({
        title: "Joueur ajouté",
        description: "Le joueur a été ajouté à votre équipe avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/teams/${user?.teamId}`] });
      setNewPlayerId("");
      setShowUserList(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'ajout du joueur.",
      });
    }
  });
  
  // State for user list modal
  const [showUserList, setShowUserList] = useState(false);

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un nom d'équipe valide.",
      });
      return;
    }
    
    createTeamMutation.mutate({ name: teamName });
  };

  if (!user?.teamId && !isTeamLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Gestion de l'équipe</h2>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">Vous n'êtes pas encore membre d'une équipe.</p>
            <Button 
              className="bg-primary hover:bg-primary-dark"
              onClick={() => setShowCreateTeamDialog(true)}
            >
              Créer une équipe
            </Button>
          </CardContent>
        </Card>
        
        <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle équipe</DialogTitle>
              <DialogDescription>
                Entrez les informations de votre nouvelle équipe. Vous serez automatiquement désigné comme capitaine.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="teamName" className="text-right text-sm font-medium">
                  Nom
                </label>
                <Input
                  id="teamName"
                  placeholder="Nom de l'équipe"
                  className="col-span-3"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleCreateTeam}
                disabled={createTeamMutation.isPending}
              >
                {createTeamMutation.isPending ? "Création..." : "Créer l'équipe"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (isTeamLoading) {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Gestion de l'équipe</h2>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="ml-6">
                <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-60"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddPlayer = () => {
    // Simple validation
    if (!newPlayerId.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez entrer un ID de joueur valide.",
      });
      return;
    }
    
    const playerId = parseInt(newPlayerId);
    if (isNaN(playerId)) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'ID du joueur doit être un nombre.",
      });
      return;
    }
    
    addPlayerMutation.mutate(playerId);
  };

  const isCaptain = team?.captainId === user?.id;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Gestion de l'équipe</h2>
        {isCaptain && (
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Modifier l'équipe
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6">
            <Avatar className="h-20 w-20 bg-gray-200">
              <AvatarFallback className="bg-gray-100">
                <Volleyball className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div className="ml-6">
              <h3 className="text-lg font-bold text-gray-900">{team?.name}</h3>
              <p className="text-gray-500">
                {team?.matchesPlayed} matchs joués · {team?.points} points
              </p>
            </div>
          </div>
          
          <h4 className="font-medium text-gray-900 mb-3">Membres de l'équipe</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers && teamMembers.length > 0 ? (
                  teamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 bg-gray-200 mr-4">
                            <AvatarFallback>
                              <UserIcon className="h-5 w-5 text-gray-400" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{member.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {member.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            team?.captainId === member.id 
                              ? "bg-green-100 text-green-800 hover:bg-green-100" 
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          }
                        >
                          {team?.captainId === member.id ? "Capitaine" : "Joueur"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" className="text-primary hover:text-primary-dark">
                          Voir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-gray-500">
                      Aucun membre dans l'équipe pour le moment.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {isCaptain && (
            <div className="mt-6 flex">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  className="pl-10"
                  placeholder="Entrez l'ID du joueur à ajouter"
                  value={newPlayerId}
                  onChange={(e) => setNewPlayerId(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <Button 
                className="ml-3 bg-primary hover:bg-primary-dark"
                onClick={handleAddPlayer}
                disabled={addPlayerMutation.isPending}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
              <Button
                className="ml-3 bg-green-600 hover:bg-green-700"
                onClick={() => setShowUserList(true)}
              >
                Voir les utilisateurs
              </Button>
            </div>
          )}
          
          {/* Liste des utilisateurs disponibles */}
          <Dialog open={showUserList} onOpenChange={setShowUserList}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Liste des utilisateurs disponibles</DialogTitle>
                <DialogDescription>
                  Sélectionnez un utilisateur à ajouter à votre équipe. Vous avez besoin de son ID.
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers?.filter(u => 
                      !teamMembers?.some(m => m.id === u.id)
                    ).map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            className="bg-indigo-100 hover:bg-indigo-200"
                            onClick={() => addPlayerMutation.mutate(user.id)}
                            disabled={addPlayerMutation.isPending}
                          >
                            Ajouter à l'équipe
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowUserList(false)}>Fermer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
