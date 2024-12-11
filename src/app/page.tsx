// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";
import FloatingCart from "@/components/floating-cart";
import { useFloatingAlert } from "@/components/floating-alert";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const { token } = useAuth(); // Obtener token desde el contexto global
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { showAlert } = useFloatingAlert();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("https://juntosback.ninjapos.pe/api/products", {
          headers: {
            authorization: token || "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los productos");
        }

        const result = await response.json();
        setProducts(result.data);
        setSuccess(true);
      } catch (error: unknown) {
        setError(
          error instanceof Error ? error.message : "Ocurrió un error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const addToCart = async (productId: number) => {
    if (!token) {
      showAlert("Para una mejor experiencia, inicie sesión", "error");
      return;
    }

    try {
      const response = await fetch(
        "https://juntosback.ninjapos.pe/api/cart/add-item",
        {
          method: "POST",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: 1, productId, quantity: 1 }),
        }
      );

      const result = await response.json();

      if (!result.status) {
        throw new Error(result.message);
      }

      showAlert(result.message, result.status ? "success" : "error");
    } catch (error) {
      console.log("Error al agregar producto al carrito:", error);
      showAlert("Error interno", "error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Catálogo de Productos</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && !error && (
        <Alert variant="default" className="mb-4">
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>¡Productos cargados exitosamente!</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="font-bold text-lg">{product.name}</CardHeader>
              <CardContent>
                {product.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="mb-4 rounded-md max-h-48 w-full object-cover"
                  />
                )}
                <p className="mb-4 text-gray-700 text-sm">{product.description}</p>
                <p className="text-lg font-bold text-primary">
                  Precio: <span className="text-2xl text-green-600">${product.price}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="default" onClick={() => addToCart(product.id)} className="w-full">
                  Agregar al Carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Carrito flotante */}
      <FloatingCart />
    </div>
  );
}
