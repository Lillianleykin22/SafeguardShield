import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, UserPlus, Users, BookOpen, AlertTriangle } from "lucide-react";
import BiometricScanner from "@/components/BiometricScanner";
import TwoFactorModal from "@/components/TwoFactorModal";

export default function Landing() {
  const [showRegister, setShowRegister] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const quickLogin = (role: string) => {
    setShowTwoFactor(true);
  };

  const handleBiometricScan = () => {
    setShowTwoFactor(true);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      {!showRegister ? (
        // Login Page
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md slide-in">
          {/* Login Header */}
          <div className="gradient-bg text-white p-8 text-center">
            <div className="text-5xl mb-4">
              <Shield className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">SafeGuard</h1>
            <p className="text-blue-100">מערכת זיהוי מוקדם לבטיחות תלמידים</p>
            <div className="mt-4 text-sm opacity-90">
              🔐 מערכת אבטחה מתקדמת | 🔑 אימות דו-שלבי | 📊 ביקורת מלאה
            </div>
          </div>
          
          {/* Login Form */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label className="text-gray-700 font-semibold">שם משתמש</Label>
                <Input 
                  type="text" 
                  placeholder="הזן שם משתמש" 
                  className="mt-2 bg-gray-50 border-2 focus:border-primary"
                />
              </div>
              
              <div>
                <Label className="text-gray-700 font-semibold">סיסמה</Label>
                <Input 
                  type="password" 
                  placeholder="הזן סיסמה" 
                  className="mt-2 bg-gray-50 border-2 focus:border-primary"
                />
              </div>
              
              <Button 
                onClick={handleLogin}
                className="w-full gradient-bg text-white py-3 hover:opacity-90 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <Shield className="ml-2 h-4 w-4" />
                התחבר למערכת
              </Button>
            </form>
            
            {/* Biometric Scanner */}
            <BiometricScanner onScan={handleBiometricScan} />
            
            {/* Quick Login */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-center text-gray-700 font-semibold mb-4">התחברות מהירה</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => quickLogin('מנהל')} 
                  variant="outline"
                  className="text-xs bg-primary text-white hover:bg-primary/90"
                >
                  מנהל
                </Button>
                <Button 
                  onClick={() => quickLogin('מורה')} 
                  variant="outline"
                  className="text-xs bg-green-600 text-white hover:bg-green-700"
                >
                  מורה
                </Button>
                <Button 
                  onClick={() => quickLogin('אבטחה')} 
                  variant="outline"
                  className="text-xs bg-orange-500 text-white hover:bg-orange-600"
                >
                  אבטחה
                </Button>
              </div>
            </div>
            
            {/* Register Link */}
            <div className="text-center mt-6">
              <button 
                onClick={() => setShowRegister(true)}
                className="text-primary hover:text-primary/80 transition-colors duration-300"
              >
                אין לך חשבון? הירשם כאן
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Register Page
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg slide-in">
          <div className="bg-green-600 text-white p-8 text-center">
            <div className="text-5xl mb-4">
              <UserPlus className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">הרשמה למערכת</h1>
            <p className="text-green-100">יצירת חשבון משתמש חדש</p>
          </div>
          
          <div className="p-8">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 font-semibold">שם פרטי</Label>
                  <Input className="mt-1 focus:border-green-500" />
                </div>
                <div>
                  <Label className="text-gray-700 font-semibold">שם משפחה</Label>
                  <Input className="mt-1 focus:border-green-500" />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-700 font-semibold">כתובת אימייל</Label>
                <Input type="email" className="mt-1 focus:border-green-500" />
              </div>
              
              <div>
                <Label className="text-gray-700 font-semibold">תפקיד</Label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none">
                  <option>בחר תפקיד</option>
                  <option>מנהל</option>
                  <option>מורה</option>
                  <option>איש אבטחה</option>
                  <option>הורה</option>
                </select>
              </div>
              
              <div>
                <Label className="text-gray-700 font-semibold">סיסמה</Label>
                <Input type="password" className="mt-1 focus:border-green-500" />
              </div>
              
              <div>
                <Label className="text-gray-700 font-semibold">אישור סיסמה</Label>
                <Input type="password" className="mt-1 focus:border-green-500" />
              </div>
              
              <Button className="w-full bg-green-600 text-white py-3 hover:bg-green-700 transition-colors duration-300">
                <UserPlus className="ml-2 h-4 w-4" />
                צור חשבון חדש
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <button 
                onClick={() => setShowRegister(false)}
                className="text-green-600 hover:text-green-700 transition-colors duration-300"
              >
                כבר יש לך חשבון? התחבר כאן
              </button>
            </div>
          </div>
        </div>
      )}
      
      <TwoFactorModal 
        isOpen={showTwoFactor} 
        onClose={() => setShowTwoFactor(false)}
        onVerify={() => {
          setShowTwoFactor(false);
          handleLogin();
        }}
      />
    </div>
  );
}
