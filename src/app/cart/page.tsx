// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: string;
  Product: {
    id: number;
    name: string;
    description: string;
    price: string;
    image_url: string | null;
  };
};

type Cart = {
  id: number;
  user_id: number;
  total_quantity: number;
  total_price: string;
  status: string;
  CartItems: CartItem[];
};

export default function CartPage() {
  const { token } = useAuth(); // Token global desde el contexto
  const router = useRouter();
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/"); // Redirige si no hay token
      return;
    }

    const fetchCarts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("https://juntosback.ninjapos.pe/api/cart/complete", {
          method: "GET",
          headers: {
            authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del carrito.");
        }

        const result = await response.json();

        if (!result.status) {
          throw new Error(result.message);
        }

        setCarts(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ha ocurrido un error desconocido.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarts();
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Historial de Compras</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {carts.map((cart) => (
          <Card key={cart.id} className="bg-white shadow-md">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Pedido #{cart.id}</h2>
              <Badge
                className={
                  cart.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }
              >
                {cart.status === "completed" ? "Completado" : "En Proceso"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-2">Productos:</p>
              {cart.CartItems.map((item) => (
                <div key={item.id} className="flex mb-4">
                  {item.Product.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.Product.image_url}
                      alt={item.Product.name}
                      className="h-16 w-16 rounded-md mr-4 object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{item.Product.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.Product.price}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <div className="w-full text-right">
                <p className="font-semibold">Total: ${cart.total_price}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
