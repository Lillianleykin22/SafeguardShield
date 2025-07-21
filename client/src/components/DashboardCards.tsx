import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, AlertTriangle } from "lucide-react";

export default function DashboardCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "סך הכל תלמידים",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "blue",
    },
    {
      title: "נוכחים היום",
      value: stats?.presentToday || 0,
      icon: UserCheck,
      color: "green",
    },
    {
      title: "נעדרים היום",
      value: stats?.absentToday || 0,
      icon: UserX,
      color: "yellow",
    },
    {
      title: "התראות פעילות",
      value: stats?.activeAlerts || 0,
      icon: AlertTriangle,
      color: "red",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-100",
          text: "text-blue-600",
          value: "text-gray-800",
        };
      case "green":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          value: "text-green-600",
        };
      case "yellow":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          value: "text-yellow-600",
        };
      case "red":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          value: "text-red-600",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          value: "text-gray-800",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const colors = getColorClasses(card.color);
        
        return (
          <Card key={index} className="safeguard-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <p className={`text-3xl font-bold ${colors.value}`}>
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${colors.text} w-6 h-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
