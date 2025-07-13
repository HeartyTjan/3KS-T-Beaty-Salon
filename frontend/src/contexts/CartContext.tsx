import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartAPI, Cart, CartItem } from '@/lib/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Safely access auth context with optional chaining
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    // Auth context not available yet, use default values
    authContext = {
      user: null,
      isAuthenticated: false,
      isLoading: true
    };
  }
  
  const { user, isAuthenticated } = authContext;
  const { toast } = useToast();

  // Load cart from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await cartAPI.getCart(user.id);
      if (response.success) {
        setCart(response.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setCart({ items: [], total: 0, itemCount: 0 }); // Treat as empty cart
      } else {
        console.error('Error loading cart:', error);
        toast({
          title: "Error",
          description: "Failed to load cart",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartAPI.addToCart(user.id, productId, quantity);
      if (response.success) {
        setCart(response.data);
        toast({
          title: "Success",
          description: "Item added to cart",
        });
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await cartAPI.removeFromCart(user.id, productId);
      if (response.success) {
        setCart(response.data);
        toast({
          title: "Success",
          description: "Item removed from cart",
        });
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await cartAPI.updateCartItem(user.id, productId, quantity);
      if (response.success) {
        setCart(response.data);
        toast({
          title: "Success",
          description: "Cart updated",
        });
      }
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cart?.itemCount || 0;
  };

  const getCartTotal = () => {
    return cart?.total || 0;
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await cartAPI.clearCart(user.id);
      if (response.success) {
        setCart(null);
        toast({
          title: "Success",
          description: "Cart cleared",
        });
      }
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartItem,
    getCartItemCount,
    getCartTotal,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 