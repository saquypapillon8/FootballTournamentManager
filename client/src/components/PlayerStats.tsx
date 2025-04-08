import { useQuery } from "@tanstack/react-query";
import { Statistics, User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Volleyball, Award, BookmarkIcon, AlertCircle } from "lucide-react";

interface PlayerStatsProps {
  userId?: number;
}

const PlayerStats = ({ userId }: PlayerStatsProps) => {
  // Get current user if userId is not provided
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/user/profile"],
    enabled: !userId,
  });
  
  const playerId = userId || currentUser?.id;
  
  const { data: stats, isLoading, error } = useQuery<Statistics>({
    queryKey: [`/api/statistics/${playerId}`],
    enabled: !!playerId,
  });

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mes statistiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gray-200"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Mes statistiques</h2>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Impossible de charger les statistiques.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statItems = [
    {
      label: "Buts marqués",
      value: stats.goalsScored,
      icon: <Volleyball className="text-xl" />,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      label: "Passes décisives",
      value: stats.assists,
      icon: <Award className="text-xl" />,
      bgColor: "bg-green-50",
      textColor: "text-green-500",
    },
    {
      label: "Cartons jaunes",
      value: stats.yellowCards,
      icon: <BookmarkIcon className="text-xl" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-500",
    },
    {
      label: "Cartons rouges",
      value: stats.redCards,
      icon: <AlertCircle className="text-xl" />,
      bgColor: "bg-red-50",
      textColor: "text-red-500",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Mes statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statItems.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${item.bgColor} ${item.textColor}`}>
                  {item.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <p className="text-3xl font-semibold text-gray-900">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlayerStats;
