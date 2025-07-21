import { useState } from "react";
import { Fingerprint } from "lucide-react";

interface BiometricScannerProps {
  onScan: () => void;
}

export default function BiometricScanner({ onScan }: BiometricScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      onScan();
    }, 1500);
  };

  return (
    <div className="text-center mt-8">
      <div 
        className={`w-20 h-20 mx-auto border-4 rounded-full flex items-center justify-center text-2xl cursor-pointer transition-all duration-300 ${
          isScanning 
            ? 'border-orange-500 bg-orange-50 biometric-scan' 
            : 'border-primary bg-blue-50 hover:bg-blue-100 biometric-scan'
        }`}
        onClick={handleScan}
      >
        <Fingerprint className={`w-8 h-8 ${isScanning ? 'text-orange-500' : 'text-primary'}`} />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {isScanning ? 'סורק...' : 'סריקה ביומטרית'}
      </p>
    </div>
  );
}
