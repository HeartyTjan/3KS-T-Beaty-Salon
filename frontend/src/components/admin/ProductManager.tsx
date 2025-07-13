import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  rating: number;
  reviews: number;
  ecoFriendly: boolean;
  image: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Eco-Friendly Hair Oil",
      description: "Natural hair oil for all hair types",
      price: "₦25,000",
      category: "Hair Care",
      rating: 4.8,
      reviews: 124,
      ecoFriendly: true,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "2",
      name: "Professional Hair Brush",
      description: "Gentle detangling brush for all hair types",
      price: "₦35,000",
      category: "Styling Tools",
      rating: 4.9,
      reviews: 89,
      ecoFriendly: true,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "3",
      name: "Natural Hair Mask",
      description: "Deep conditioning treatment for damaged hair",
      price: "₦45,000",
      category: "Hair Care",
      rating: 4.7,
      reviews: 156,
      ecoFriendly: true,
      image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "4",
      name: "Styling Gel",
      description: "Strong hold gel for defined styles",
      price: "₦20,000",
      category: "Styling",
      rating: 4.6,
      reviews: 203,
      ecoFriendly: false,
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "5",
      name: "Hair Clips Set",
      description: "Professional hair clips for styling",
      price: "₦15,000",
      category: "Styling Tools",
      rating: 4.5,
      reviews: 78,
      ecoFriendly: true,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: "6",
      name: "Heat Protectant Spray",
      description: "Protects hair from heat damage",
      price: "₦30,000",
      category: "Hair Care",
      rating: 4.8,
      reviews: 142,
      ecoFriendly: true,
      image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    rating: 0,
    reviews: 0,
    ecoFriendly: false,
    image: ""
  });

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditingProduct(product);
  };

  const handleSave = () => {
    if (editingId) {
      setProducts(prev => prev.map(product => 
        product.id === editingId 
          ? editingProduct
          : product
      ));
      setEditingId(null);
      setEditingProduct({
        id: "",
        name: "",
        description: "",
        price: "",
        category: "",
        rating: 0,
        reviews: 0,
        ecoFriendly: false,
        image: ""
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingProduct({
      id: "",
      name: "",
      description: "",
      price: "",
      category: "",
      rating: 0,
      reviews: 0,
      ecoFriendly: false,
      image: ""
    });
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button className="brand-gradient text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover-lift">
            <div className="relative h-48 overflow-hidden rounded-t-lg">
              <img 
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-white/90 text-primary">{product.price}</Badge>
              </div>
              {product.ecoFriendly && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-green-500/90 text-white">🌿 Eco</Badge>
                </div>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <div className="flex gap-2">
                  {editingId === product.id ? (
                    <>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              
              <Badge variant="secondary" className="mb-3">{product.category}</Badge>
              
              {editingId === product.id && (
                <div className="space-y-3 mt-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g., ₦25,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, image: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="ecoFriendly"
                      checked={editingProduct.ecoFriendly}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, ecoFriendly: e.target.checked }))}
                    />
                    <Label htmlFor="ecoFriendly">Eco-Friendly</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
