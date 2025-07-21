import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
}

export default function TwoFactorModal({ isOpen, onClose, onVerify }: TwoFactorModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (code.every(digit => digit !== '')) {
      onVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4 slide-in">
        <DialogHeader className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-800">אימות דו-שלבי</DialogTitle>
          <p className="text-gray-600 mt-2">הזן את קוד האימות ששלחנו למכשירך</p>
        </DialogHeader>
        
        <div className="flex justify-center gap-2 mb-6">
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl border-2 focus:border-primary"
            />
          ))}
        </div>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            ביטול
          </Button>
          <Button
            onClick={handleVerify}
            disabled={!code.every(digit => digit !== '')}
            className="flex-1 gradient-bg text-white hover:opacity-90"
          >
            אמת קוד
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
