// src/components/menu.tsx
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
  const { token, setToken } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setToken(null); // Elimina el token
    router.push("/"); // Redirige al usuario a la página principal
  };

  return (
    <div className="flex items-center space-x-4">
      {token ? (
        <>
          <Button variant="ghost" onClick={() => router.push("/cart")}>
            Purchases
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <LoginForm />
          <RegisterForm />
        </>
      )}
    </div>
  );
}
