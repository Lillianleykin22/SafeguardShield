import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, X, AlertTriangle, Clock, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function AlertsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      await apiRequest("PATCH", `/api/alerts/${alertId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "הצלחה",
        description: "התראה נפתרה בהצלחה",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "לא מורשה",
          description: "אתה מנותק. מתחבר מחדש...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "שגיאה",
        description: "לא ניתן לפתור את ההתראה",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="safeguard-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="ml-2 w-5 h-5 text-red-500" />
            התראות פעילות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="border rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="text-white text-sm w-4 h-4" />;
      case 'medium':
        return <Clock className="text-white text-sm w-4 h-4" />;
      default:
        return <Info className="text-white text-sm w-4 h-4" />;
    }
  };

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          iconBg: 'bg-red-500',
        };
      case 'medium':
        return {
          border: 'border-yellow-200',
          bg: 'bg-yellow-50',
          iconBg: 'bg-yellow-500',
        };
      default:
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-500',
        };
    }
  };

  return (
    <Card className="safeguard-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="ml-2 w-5 h-5 text-red-500" />
          התראות פעילות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">אין התראות פעילות</p>
          ) : (
            alerts?.map((alert: any) => {
              const styles = getAlertStyles(alert.severity);
              
              return (
                <div key={alert.id} className={`border ${styles.border} ${styles.bg} rounded-lg p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center`}>
                        {getAlertIcon(alert.severity)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{alert.title}</p>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.createdAt).toLocaleString('he-IL')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => resolveAlertMutation.mutate(alert.id)}
                      disabled={resolveAlertMutation.isPending}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
