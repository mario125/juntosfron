// src/app/auth/login/page.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Inicio de sesión enviado");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-[var(--background-color)] text-[var(--text-color)] p-6 rounded-md shadow-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Correo electrónico
          </label>
          <Input id="email" type="email" placeholder="Ingresa tu correo" required />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Contraseña
          </label>
          <Input id="password" type="password" placeholder="Ingresa tu contraseña" required />
        </div>
        <Button type="submit" className="w-full">
          Iniciar Sesión
        </Button>
      </form>
    </div>
  );
}
