import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Shield, Users, AlertTriangle, BarChart3, Settings, Bell } from "lucide-react";
import DashboardCards from "@/components/DashboardCards";
import StudentTable from "@/components/StudentTable";
import ActivityLog from "@/components/ActivityLog";
import AlertsPanel from "@/components/AlertsPanel";

type TabType = 'dashboard' | 'students' | 'alerts' | 'reports' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
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
  }, [user, isLoading, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'לוח הבקרה', icon: BarChart3 },
    { id: 'students', label: 'ניהול תלמידים', icon: Users },
    { id: 'alerts', label: 'התראות', icon: AlertTriangle },
    { id: 'reports', label: 'דוחות', icon: BarChart3 },
    { id: 'settings', label: 'הגדרות', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">SafeGuard</h1>
              <p className="text-blue-100 text-sm">מערכת בטיחות מתקדמת</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-blue-100 transition-colors duration-300"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -left-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </Button>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <img 
                src={(user as any)?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"} 
                alt="פרופיל משתמש" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
              />
              <div className="text-sm">
                <div className="font-semibold">{(user as any)?.firstName} {(user as any)?.lastName}</div>
                <div className="text-blue-100">{(user as any)?.role}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-white hover:text-blue-100 transition-colors duration-300"
              >
                <Shield className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`nav-tab py-4 px-2 border-b-2 transition-all duration-300 ${
                    activeTab === item.id
                      ? 'border-primary text-primary'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Icon className="ml-2 w-4 h-4 inline" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">לוח בקרה ראשי</h2>
            <DashboardCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ActivityLog />
              <AlertsPanel />
            </div>
          </div>
        )}
        
        {activeTab === 'students' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">ניהול תלמידים</h2>
              <Button className="bg-primary text-white hover:bg-primary/90">
                <Users className="ml-2 w-4 h-4" />
                הוסף תלמיד חדש
              </Button>
            </div>
            <StudentTable />
          </div>
        )}
        
        {activeTab === 'alerts' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">ניהול התראות</h2>
            <div className="safeguard-card">
              <p className="text-gray-600">תוכן ניהול התראות יבוא כאן...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">דוחות ונתונים</h2>
            <div className="safeguard-card">
              <p className="text-gray-600">תוכן דוחות ונתונים יבוא כאן...</p>
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">הגדרות מערכת</h2>
            <div className="safeguard-card">
              <p className="text-gray-600">תוכן הגדרות מערכת יבוא כאן...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
