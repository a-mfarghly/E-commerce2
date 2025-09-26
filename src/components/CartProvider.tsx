"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartService, CartItem } from '@/services/clientApi';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const refreshCart = () => {
    const items = cartService.getCart();
    const count = cartService.getCartItemsCount();
    const total = cartService.getCartTotal();
    
    setCartItems(items);
    setCartCount(count);
    setCartTotal(total);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = (productId: string, quantity: number = 1) => {
    try {
      cartService.addToCart(productId, quantity);
      refreshCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = (productId: string) => {
    try {
      cartService.removeFromCart(productId);
      refreshCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItem = (productId: string, quantity: number) => {
    try {
      cartService.updateCartItem(productId, quantity);
      refreshCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const clearCart = () => {
    try {
      cartService.clearCart();
      refreshCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

