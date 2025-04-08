import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
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

  if (!user || (!isAdmin && !isSuperAdmin)) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panneau d'Administration</h1>
        <Button onClick={() => navigate("/dashboard")}>
          Retour au tableau de bord
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Gestion des Équipes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ajoutez, modifiez ou supprimez des équipes. Gérez les capitaines et les membres.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/admin/teams")}
            >
              Gérer les équipes
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Gestion des Matchs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Planifiez des matchs, mettez à jour les scores et gérez les statuts des rencontres.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/admin/matches")}
            >
              Gérer les matchs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Administrez les comptes utilisateurs, attribuez des rôles et gérez les permissions.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/admin/users")}
            >
              Gérer les utilisateurs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Consultez et modifiez les statistiques des joueurs et des équipes.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/admin/statistics")}
            >
              Voir les statistiques
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Tableau de bord</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Vue d'ensemble des équipes, matchs et statistiques avec graphiques.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/admin/dashboard")}
            >
              Voir le tableau de bord
            </Button>
          </CardContent>
        </Card>

        {isSuperAdmin && (
          <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Paramètres avancés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Paramètres système, gestion des sauvegardes et opérations administratives.
              </p>
              <Button
                className="w-full"
                variant="destructive"
                onClick={() => navigate("/admin/settings")}
              >
                Paramètres avancés
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;