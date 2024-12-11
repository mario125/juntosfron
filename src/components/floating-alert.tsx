"use client";

import { createContext, useContext, useState } from "react";
import {  AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react"; 
type AlertData = {
  message: string;
  type: "success" | "error";
};

type FloatingAlertContextType = {
  showAlert: (message: string, type: "success" | "error") => void;
};

const FloatingAlertContext = createContext<FloatingAlertContextType | null>(null);

export function useFloatingAlert() {
  const context = useContext(FloatingAlertContext);
  if (!context) {
    throw new Error("useFloatingAlert must be used within a FloatingAlertProvider");
  }
  return context;
}

export function FloatingAlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertData | null>(null);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000); // Ocultar alerta después de 3 segundos
  };

  return (
    <FloatingAlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`flex items-center gap-4 px-4 py-3 rounded-md shadow-lg ${
              alert.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {/* Definir ícono dinámicamente */}
            {alert.type === "success" ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <AlertCircle className="h-6 w-6" />
            )}
            <div>
              <AlertTitle className="font-bold">
                {alert.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </div>
          </div>
        </div>
      )}
    </FloatingAlertContext.Provider>
  );
}
