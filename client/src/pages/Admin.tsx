import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const { user, isAdmin, isSuperAdmin } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!user || (!isAdmin && !isSuperAdmin)) {
      navigate("/login");
    }
  }, [user, isAdmin, isSuperAdmin, navigate]);

  if (!user || (!isAdmin && !isSuperAdmin)) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panneau d'administration</h1>
        <Button 
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Retour au tableau de bord
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>Gestion des équipes</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Créez, modifiez ou supprimez des équipes.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate("/teams")}
            >
              Gérer les équipes
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="bg-green-50">
            <CardTitle>Gestion des matchs</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Planifiez et gérez les matchs du tournoi.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate("/matches")}
            >
              Gérer les matchs
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="bg-purple-50">
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Consultez et modifiez les statistiques des joueurs.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate("/leaderboard")}
            >
              Voir les statistiques
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Admin;