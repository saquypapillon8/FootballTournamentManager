import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Volleyball, Award } from "lucide-react";
import PlayerStats from "@/components/PlayerStats";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Team } from "@shared/schema";

const PlayerProfile = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [, params] = useRoute<{ id: string }>("/player/:id");
  const [, navigate] = useLocation();
  const playerId = params ? parseInt(params.id) : user?.id;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Get player profile
  const { data: playerData, isLoading: playerLoading } = useQuery({
    queryKey: ["/api/user/profile", playerId],
    enabled: isAuthenticated && !!playerId,
    queryFn: async ({ queryKey }) => {
      const [_, id] = queryKey;
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error("Erreur lors du chargement du profil");
      return response.json();
    }
  });

  // Get player team
  const { data: teams } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    enabled: isAuthenticated,
  });

  const playerTeam = teams?.find((team: Team) => team.id === playerData?.teamId);

  if (authLoading || playerLoading) {
    return (
      <div className="py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !playerData) {
    return null;
  }

  const isCurrentUser = user?.id === playerData.id;

  return (
    <div className="py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-6">
          <CardContent className="pt-6 px-6">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <Avatar className="h-32 w-32 mb-4 md:mb-0 md:mr-8">
                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                  {playerData.name?.[0]?.toUpperCase() || <User className="h-16 w-16" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{playerData.name}</h1>
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
                    ID: {playerData.id}
                  </Badge>
                </div>
                {playerTeam && (
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <Volleyball className="mr-2 h-5 w-5 text-primary" />
                    <span className="text-gray-600">{playerTeam.name}</span>
                    {playerTeam.captainId === playerData.id && (
                      <Badge className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Capitaine
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start space-x-4 mb-6">
                  <div className="text-gray-600 text-sm">
                    <span className="font-medium">Membre depuis:</span>{" "}
                    {playerData.dateRegistered ? format(new Date(playerData.dateRegistered), "d MMMM yyyy", { locale: fr }) : "N/A"}
                  </div>
                  <div className="text-gray-600 text-sm">
                    <span className="font-medium">Email:</span> {playerData.email}
                  </div>
                </div>
                
                {isCurrentUser && (
                  <Button className="bg-primary hover:bg-primary/90">
                    Modifier mon profil
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="statistics" className="mb-8">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            <TabsTrigger value="history">Historique des matchs</TabsTrigger>
            <TabsTrigger value="achievements">Réalisations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="statistics" className="p-1">
            <Card>
              <CardContent className="pt-6">
                <PlayerStats userId={playerData.id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="p-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Volleyball className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Pas encore de matchs</h3>
                    <p className="text-gray-500">L'historique des matchs sera disponible après avoir participé à des matchs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="achievements" className="p-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Pas encore de réalisations</h3>
                    <p className="text-gray-500">Les réalisations seront débloquées au fur et à mesure de votre progression.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlayerProfile;