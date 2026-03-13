"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CartContextType {
  count: number;
  refreshCart: () => Promise<void>;
  addToCart: (recipeId: string) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const refreshCart = async () => {
    try {
      const res = await fetch("/api/meal-plan");
      if (res.ok) {
        const data = await res.json();
        setCount(data.items?.length || 0);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const addToCart = async (recipeId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      if (res.ok) {
        setCount((prev) => prev + 1);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      return false;
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider value={{ count, refreshCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
