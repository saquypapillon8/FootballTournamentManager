import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Team, User } from "@shared/schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Volleyball, User as UserIcon, Trophy, UsersRound } from "lucide-react";

const Teams = () => {
  const [teamDetailsId, setTeamDetailsId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get all teams
  const { data: teams, isLoading: isTeamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  // Get all users
  const { data: users, isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Find team by ID
  const getTeamById = (id: number) => {
    return teams?.find(team => team.id === id);
  };

  // Find user by ID
  const getUserById = (id: number) => {
    return users?.find(user => user.id === id);
  };

  // Get team members
  const getTeamMembers = (team: Team) => {
    if (!users || !team.players) return [];
    
    return users.filter(user => 
      Array.isArray(team.players) && team.players.includes(user.id)
    );
  };

  // Filter teams by search query
  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = isTeamsLoading || isUsersLoading;

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Équipes</h1>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Équipes</h1>

        <div className="relative mb-6">
          <Input
            className="pl-10"
            placeholder="Rechercher une équipe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
        </div>

        {filteredTeams && filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 bg-gray-100 mr-2">
                        <AvatarFallback className="bg-gray-100">
                          <Volleyball className="h-5 w-5 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription>
                          {team.players && Array.isArray(team.players) 
                            ? `${team.players.length} joueurs` 
                            : "0 joueur"}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-teal-600">
                      {team.points} pts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex items-center text-sm space-x-4 mb-3">
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-600">
                        {team.matchesPlayed} matchs joués
                      </span>
                    </div>
                    <div className="flex items-center">
                      <UsersRound className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-600">
                        {team.captainId 
                          ? `Capitaine: ${getUserById(team.captainId)?.name || "Inconnu"}`
                          : "Pas de capitaine"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="text-teal-700"
                        onClick={() => setTeamDetailsId(team.id)}
                      >
                        Voir détails
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Détails de l'équipe</DialogTitle>
                        <DialogDescription>
                          Informations complètes sur l'équipe et ses joueurs
                        </DialogDescription>
                      </DialogHeader>
                      {teamDetailsId && (
                        <TeamDetails 
                          team={getTeamById(teamDetailsId)!} 
                          members={getTeamMembers(getTeamById(teamDetailsId)!)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">
                {searchQuery 
                  ? "Aucune équipe ne correspond à votre recherche." 
                  : "Aucune équipe disponible pour le moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

interface TeamDetailsProps {
  team: Team;
  members: User[];
}

const TeamDetails = ({ team, members }: TeamDetailsProps) => {
  const sortedMembers = [...members];
  
  // Put captain first
  if (team.captainId) {
    sortedMembers.sort((a, b) => 
      a.id === team.captainId ? -1 : b.id === team.captainId ? 1 : 0
    );
  }

  // Calculate win/draw/loss (this would be better from API)
  const calculateTeamRecord = () => {
    // Simplified version
    const wins = Math.floor(team.points / 3);
    const draws = team.points % 3;
    const losses = team.matchesPlayed - wins - draws;
    
    return { wins, draws, losses };
  };

  const { wins, draws, losses } = calculateTeamRecord();

  return (
    <div className="mt-4">
      <div className="flex items-center mb-6">
        <Avatar className="h-16 w-16 bg-gray-100">
          <AvatarFallback className="bg-gray-100">
            <Volleyball className="h-8 w-8 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
          <p className="text-gray-500">
            {team.matchesPlayed} matchs joués · {team.points} points
          </p>
        </div>
      </div>

      <Tabs defaultValue="stats">
        <TabsList className="mb-4">
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="players">Joueurs</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-teal-700">{team.points}</p>
                  <p className="text-sm text-gray-500 mt-1">Points</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-600">{wins}</p>
                  <p className="text-sm text-gray-500 mt-1">Victoires</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-yellow-600">{draws}</p>
                  <p className="text-sm text-gray-500 mt-1">Nuls</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-red-600">{losses}</p>
                  <p className="text-sm text-gray-500 mt-1">Défaites</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance de l'équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-green-200 text-green-600">
                      {team.matchesPlayed > 0 
                        ? Math.round((wins / team.matchesPlayed) * 100) 
                        : 0}% de victoires
                    </span>
                  </div>
                </div>
                <div className="flex h-2 mb-4 overflow-hidden rounded bg-gray-200">
                  <div style={{ width: `${(wins / Math.max(team.matchesPlayed, 1)) * 100}%` }} className="bg-green-500"></div>
                  <div style={{ width: `${(draws / Math.max(team.matchesPlayed, 1)) * 100}%` }} className="bg-yellow-500"></div>
                  <div style={{ width: `${(losses / Math.max(team.matchesPlayed, 1)) * 100}%` }} className="bg-red-500"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>V: {wins}</span>
                  <span>N: {draws}</span>
                  <span>D: {losses}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardContent className="p-0">
              {members.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Joueur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback className={
                                member.id === team.captainId
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-gray-100 text-gray-600"
                              }>
                                <UserIcon className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium text-gray-900">
                              {member.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {member.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            member.id === team.captainId
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }>
                            {member.id === team.captainId ? "Capitaine" : "Joueur"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Aucun joueur dans cette équipe.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Teams;
