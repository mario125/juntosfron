// src/components/floating-cart.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/context/auth-context";
import { useFloatingAlert } from "@/components/floating-alert";

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

type CartData = {
  id: number;
  user_id: number;
  total_quantity: number;
  total_price: string;
  CartItems: CartItem[];
};

export default function FloatingCart() {
  const { token } = useAuth();
  const { showAlert } = useFloatingAlert();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const response = await fetch("https://juntosback.ninjapos.pe/api/cart", {
          method: "GET",
          headers: {
            authorization: token,
          },
        });

        const result = await response.json();

        if (result.status && result.data) {
          setCart(result.data);
        } else {
          console.log("No active cart found:", result.message);

          // Crear carrito si no existe
          try {
            const createCartResponse = await fetch("https://juntosback.ninjapos.pe/api/cart", {
              method: "POST",
              headers: {
                authorization: token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ userId: 1 }), // Reemplaza con el ID real del usuario si es necesario
            });

            const createCartResult = await createCartResponse.json();

            if (createCartResult.status) {
              setCart(createCartResult.data);
              showAlert("Carrito creado exitosamente", "success");
            } else {
              showAlert(createCartResult.message, "error");
            }
          } catch (createError) {
            console.error("Error creating cart:", createError);
            showAlert("Error al crear el carrito", "error");
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        showAlert("Error al obtener el carrito", "error");
      }
    };

    fetchCart();
  }, [token, showAlert]);

  const updateCart = async (productId: number, quantity: number) => {
    if (!cart) return;

    const url = quantity > 0
      ? "https://juntosback.ninjapos.pe/api/cart/add-item"
      : "https://juntosback.ninjapos.pe/api/cart/remove-item";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          authorization: token!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: cart.user_id, productId, quantity: Math.abs(quantity) }),
      });

      const result = await response.json();

      if (result.status) {
        setCart(result.data);
        showAlert("Carrito actualizado correctamente", "success");
      } else {
        showAlert(result.message, "error");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      showAlert("Error al actualizar el carrito", "error");
    }
  };

  const completePurchase = async () => {
    if (!cart) return;

    try {
      const response = await fetch(
        "https://juntosback.ninjapos.pe/api/cart/update-status",
        {
          method: "POST",
          headers: {
            authorization: token!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: cart.user_id, cartId: cart.id }),
        }
      );

      const result = await response.json();

      if (result.status) {
        setCart(null);
        showAlert("Compra completada exitosamente!", "success");
      } else {
        showAlert(result.message, "error");
      }
    } catch (error) {
      console.error("Error completing purchase:", error);
      showAlert("Error al completar la compra", "error");
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className="w-16 h-16 rounded-full shadow-lg">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cart?.total_quantity && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart?.total_quantity}
                </span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h2 className="text-lg font-semibold mb-4">Carrito de Compras</h2>
          {!(cart?.CartItems && cart.CartItems.length > 0) ? (
            <p>Tu carrito está vacío</p>
          ) : (
            cart.CartItems.map((item) => (
              <div key={item.product_id} className="mb-2">
                <div className="flex justify-between items-center">
                  <span>
                    {item.Product.name} (x{item.quantity})
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCart(item.product_id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCart(item.product_id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
          {cart && (
            <div className="mt-4 pt-4 border-t">
              <p className="font-semibold">
                Total: ${parseFloat(cart.total_price).toFixed(2)}
              </p>
              <Button
                className="w-full mt-2"
                onClick={completePurchase}
                disabled={!cart.total_quantity}
              >
                Completar Compra
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
