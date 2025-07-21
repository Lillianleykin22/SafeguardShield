import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, UserCheck, AlertTriangle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

export default function ActivityLog() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card className="safeguard-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="ml-2 w-5 h-5 text-primary" />
            פעילות אחרונה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <UserCheck className="text-white text-sm w-4 h-4" />;
      case 'alert':
        return <AlertTriangle className="text-white text-sm w-4 h-4" />;
      default:
        return <Info className="text-white text-sm w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'attendance':
        return 'bg-green-500';
      case 'alert':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card className="safeguard-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="ml-2 w-5 h-5 text-primary" />
          פעילות אחרונה
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 custom-scrollbar max-h-80 overflow-y-auto">
          {activities?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">אין פעילות להצגה</p>
          ) : (
            activities?.map((activity: any, index: number) => (
              <div key={activity.id || index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-300">
                <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.description}</p>
                  <p className="text-gray-500 text-sm">
                    {activity.metadata?.className && `כיתה ${activity.metadata.className}`}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(activity.createdAt), { 
                    addSuffix: true, 
                    locale: he 
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
