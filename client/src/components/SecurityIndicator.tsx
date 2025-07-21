import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

type SecurityLevel = 'success' | 'warning' | 'danger';

interface SecurityIndicatorProps {
  level?: SecurityLevel;
  message?: string;
}

export default function SecurityIndicator({ 
  level = 'success', 
  message = 'מערכת פעילה - רמת אבטחה גבוהה' 
}: SecurityIndicatorProps) {
  const [currentLevel, setCurrentLevel] = useState<SecurityLevel>(level);
  const [currentMessage, setCurrentMessage] = useState(message);

  useEffect(() => {
    // Update security status based on system state
    const updateSecurityStatus = () => {
      const isLoggedIn = window.location.pathname !== '/';
      if (isLoggedIn) {
        setCurrentLevel('success');
        setCurrentMessage('מחובר בהצלחה - מערכת פעילה');
      } else {
        setCurrentLevel('warning');
        setCurrentMessage('מנותק - נדרש אימות מחדש');
      }
    };

    updateSecurityStatus();
    
    // Listen for navigation changes
    const handleNavigation = () => {
      setTimeout(updateSecurityStatus, 100);
    };
    
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const getIcon = () => {
    switch (currentLevel) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'danger':
        return <Shield className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getClassName = () => {
    const baseClasses = "fixed top-4 left-4 z-50 px-4 py-2 rounded-full text-sm font-medium pulse-security text-white";
    
    switch (currentLevel) {
      case 'success':
        return `${baseClasses} bg-green-600`;
      case 'warning':
        return `${baseClasses} bg-orange-500`;
      case 'danger':
        return `${baseClasses} bg-red-600`;
      default:
        return `${baseClasses} bg-green-600`;
    }
  };

  return (
    <div className={getClassName()}>
      <div className="flex items-center gap-2">
        {getIcon()}
        <span>{currentMessage}</span>
      </div>
    </div>
  );
}
