import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useAvailableProducts } from "@/hooks/use-api";
import { useAuth } from "@/contexts/AuthContext";

const Products = () => {
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const { addToCart, getCartItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch products from backend
  const { data: productsResponse, isLoading, error } = useAvailableProducts();
  
  // Handle different response structures
  let products = [];
  if (productsResponse) {
    if (productsResponse.data && Array.isArray(productsResponse.data)) {
      products = productsResponse.data;
    } else if (Array.isArray(productsResponse)) {
      products = productsResponse;
    } else if (productsResponse.data && productsResponse.data.content) {
      products = productsResponse.data.content;
    }
  }

  console.log('Products response:', productsResponse);
  console.log('Processed products:', products);

  const handleAddToCart = async (productId: string, productName: string, productPrice: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(productId, 1);
      setShowNotification(`${productName} added to cart!`);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewCart = () => {
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Products
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Premium Hair & Beauty Products
              <span className="text-transparent bg-clip-text brand-gradient block">
               ....
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover our curated collection of professional hair and beauty products, 
              designed to help you achieve your best look.
            </p>
          </div>
          
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Products error:', error);
    return (
      <section id="products" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Our Products
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Premium Hair & Beauty
              <span className="text-transparent bg-clip-text brand-gradient block">
                Products
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover our curated collection of professional hair and beauty products, 
              designed to help you achieve your best look.
            </p>
          </div>
          
          <div className="text-center py-20">
            <p className="text-muted-foreground">Failed to load products. Please try again later.</p>
            <p className="text-sm text-muted-foreground mt-2">Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Our Products
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Premium Hair & Beauty
            <span className="text-transparent bg-clip-text brand-gradient block">
              Products
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover our curated collection of professional hair and beauty products, 
            designed to help you achieve your best look.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">Please check back later or contact us for assistance.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="hover-lift overflow-hidden bg-card border-border">
                <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-white overflow-hidden">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-4 left-4">
                    {product.ecoFriendly ? (
                      <Badge className="bg-green-500/90 text-white border-0">
                        🌿 Eco
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/90 text-white border-0">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-primary border-0">
                      ₦{product.price?.toLocaleString() || '0'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">{product.name}</CardTitle>
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating || 4.8}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews || 24} reviews)</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">₦{product.price?.toLocaleString() || '0'}</span>
                    {product.stockQuantity > 0 ? (
                      <Badge variant="secondary" className="text-green-600">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <Button 
                    className="w-full brand-gradient text-white hover-lift flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    onClick={() => handleAddToCart(product.id, product.name, product.price || 0)}
                    disabled={product.stockQuantity === 0}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12 space-y-4">
          <Button size="lg" variant="outline" className="hover-lift transition-all duration-200 hover:scale-105 mr-4">
            View All Products
          </Button>
          {getCartItemCount() > 0 && (
            <Button 
              size="lg" 
              className="brand-gradient text-white hover-lift transition-all duration-200 hover:scale-105"
              onClick={handleViewCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Cart ({getCartItemCount()} items)
            </Button>
          )}
        </div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-4 duration-300 z-50">
          {showNotification}
        </div>
      )}
    </section>
  );
};

export default Products;

