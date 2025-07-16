import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Calendar, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import UserMenu from './UserMenu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { cart, getCartItemCount, getCartTotal, updateCartItem, removeFromCart } = useCart();

  const handleBookNow = () => {
    navigate("/booking");
  };

  const handleCallNow = () => {
    window.location.href = "tel:+2341234567890";
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateCartItem(productId, newQuantity);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">3KS&T</h1>
            <p className="text-xs text-muted-foreground ml-2">Hair • Fashion • Beauty</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#products" className="text-foreground hover:text-primary transition-colors">Products</a>
            <a href="#portfolio" className="text-foreground hover:text-primary transition-colors">Portfolio</a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">Reviews</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
            {isAuthenticated && (
              <Link to="/dashboard/profile" className="text-foreground hover:text-primary transition-colors">Profile</Link>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative px-3">
                  <ShoppingCart className="w-4 h-4" />
                  {getCartItemCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-primary text-primary-foreground">
                      {getCartItemCount()}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <CardHeader>
                  <CardTitle className="text-lg">Shopping Cart</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {!cart || cart.items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">Your cart is empty</p>
                  ) : (
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              ₦{item.price.toLocaleString()} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                            <span className="font-semibold text-sm">
                              ₦{item.subtotal.toLocaleString()}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromCart(item.productId)}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total:</span>
                          <span className="text-primary">₦{getCartTotal().toLocaleString()}</span>
                        </div>
                        <Button 
                          className="w-full mt-3 brand-gradient text-white"
                          onClick={handleCheckout}
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Login/Logout UI */}
            {!isAuthenticated ? (
              <>
                <Button
                  size="sm"
                  className="bg-primary text-white font-semibold hover:bg-primary/90 transition px-4"
                  onClick={() => setShowLogin(true)}
                >
                  Login
                </Button>
                <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
              </>
            ) : (
              <UserMenu />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="px-3"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {/* ...Mobile navigation here... */}
      </div>
      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-2 bg-background rounded-lg shadow-lg py-4 px-6 space-y-4 absolute left-0 right-0 top-16 z-40">
          <a href="#services" className="block text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Services</a>
          <a href="#products" className="block text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Products</a>
          <a href="#portfolio" className="block text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Portfolio</a>
          <a href="#testimonials" className="block text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Reviews</a>
          <a href="#contact" className="block text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Contact</a>
          {isAuthenticated && (
            <Link to="/dashboard/profile" className="block text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>Profile</Link>
          )}
          {/* Mobile Login/Logout UI */}
          {!isAuthenticated ? (
            <Button
              className="w-full bg-primary text-white font-semibold hover:bg-primary/90 transition"
              onClick={() => {
                setShowLogin(true);
                setIsOpen(false);
              }}
            >
              Login
            </Button>
          ) : (
            <UserMenu />
          )}
          <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navigation;
