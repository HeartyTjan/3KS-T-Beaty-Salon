import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { productAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  ecoFriendly: boolean;
  imageUrl: string;
  stockQuantity: number;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    productAPI.getAllProducts().then(res => {
      if (res && res.data && res.data.content) {
        setProducts(res.data.content);
      } else if (res && Array.isArray(res)) {
        setProducts(res);
      } else {
        setProducts([]);
      }
    }).catch(error => {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    });
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    reviews: 0,
    ecoFriendly: false,
    imageUrl: "",
    stockQuantity: 0,
    available: true,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    rating: 0,
    reviews: 0,
    ecoFriendly: false,
    imageUrl: "",
    stockQuantity: 0,
    available: true,
  });

  const [saving, setSaving] = useState(false);

  const validateProduct = (product: Partial<Product>) => {
    const errors: string[] = [];
    
    if (!product.name || product.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!product.description || product.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    if (!product.category || product.category.trim().length === 0) {
      errors.push('Category is required');
    }
    
    if (product.price === undefined || product.price < 0) {
      errors.push('Price must be a valid positive number');
    }
    
    if (product.stockQuantity === undefined || product.stockQuantity < 0) {
      errors.push('Stock quantity must be a valid positive number');
    }
    
    return errors;
  };

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  function CustomCloudinaryUpload({ onUpload }) {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setProgress(0);
      setUploading(true);
      setError('');
      setSuccess('');
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.secure_url) {
            onUpload(data.secure_url);
            setSuccess('Upload successful!');
            setError('');
            toast.success('Upload successful!');
            console.log('Cloudinary media URL:', data.secure_url);
          } else {
            setError('Upload failed');
            setSuccess('');
            toast.error('Upload failed');
          }
        } else {
          setUploading(false);
          setError('Upload failed');
          setSuccess('');
          toast.error('Upload failed');
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setError('Upload failed');
        setSuccess('');
        toast.error('Upload failed');
      };
      xhr.send(formData);
    };

    return (
      <div>
        <input
          type="file"
          accept="image/*,video/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Image/Video'}
        </Button>
        {uploading && (
          <div className="w-32 mt-2">
            <div className="h-2 bg-gray-200 rounded">
              <div className="h-2 bg-primary rounded" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-gray-500 mt-1">{progress}%</div>
          </div>
        )}
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        {success && <div className="text-xs text-green-600 mt-1">{success}</div>}
      </div>
    );
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditingProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      ecoFriendly: product.ecoFriendly,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity,
      available: product.available,
    });
  };

  const handleSave = async () => {
    const errors = validateProduct(editingProduct);
    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return;
    }

    setSaving(true);
    try {
      const response = await productAPI.updateProduct(editingId!, editingProduct);
      if (response.success) {
        setProducts(prev => prev.map(product => 
          product.id === editingId 
            ? { ...product, ...editingProduct }
            : product
        ));
        setEditingId(null);
        setEditingProduct({
          id: "",
          name: "",
          description: "",
          price: 0,
          category: "",
          rating: 0,
          reviews: 0,
          ecoFriendly: false,
          imageUrl: "",
          stockQuantity: 0,
          available: true,
        });
        toast.success('Product updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      category: "",
      rating: 0,
      reviews: 0,
      ecoFriendly: false,
      imageUrl: "",
      stockQuantity: 0,
      available: true,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await productAPI.deleteProduct(id);
      if (response.success) {
        setProducts(prev => prev.filter(product => product.id !== id));
        toast.success('Product deleted successfully!');
      } else {
        toast.error(response.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
    setNewProduct({
      id: "",
      name: "",
      description: "",
      price: 0,
      category: "",
      rating: 0,
      reviews: 0,
      ecoFriendly: false,
      imageUrl: "",
      stockQuantity: 0,
      available: true,
    });
  };

  const handleAddSubmit = async () => {
    const errors = validateProduct(newProduct);
    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return;
    }

    setSaving(true);
    try {
      // Remove id before sending to backend
      const { id, ...productToCreate } = newProduct;
      const response = await productAPI.createProduct(productToCreate);
      if (response.success) {
        setProducts(prev => [...prev, response.data]);
        setShowAddModal(false);
        setNewProduct({
          id: "",
          name: "",
          description: "",
          price: 0,
          category: "",
          rating: 0,
          reviews: 0,
          ecoFriendly: false,
          imageUrl: "",
          stockQuantity: 0,
          available: true,
        });
        toast.success('Product created successfully!');
      } else {
        toast.error(response.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button className="brand-gradient text-white" onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="hover-lift">
            <div className="relative h-48 flex items-center justify-center bg-white p-2 overflow-hidden rounded-t-lg">
              <img 
                src={product.imageUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-white/90 text-primary">₦{product.price?.toLocaleString()}</Badge>
              </div>
              {product.ecoFriendly && (
                <div className="absolute top-2 left-2">
                  <Badge className="bg-green-500/90 text-white">🌿 Eco</Badge>
                </div>
              )}
              <div className="absolute bottom-2 left-2">
                <Badge variant={product.available ? "default" : "secondary"}>
                  {product.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <div className="flex gap-2">
                  {editingId === product.id ? (
                    <>
                      <Button size="sm" onClick={handleSave} disabled={saving}>
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
                      className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews || 0} reviews)</span>
              </div>
              
              <div className="flex gap-2 mb-3">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">Stock: {product.stockQuantity || 0}</Badge>
              </div>
              
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
                      type="text"
                      inputMode="decimal"
                      value={editingProduct.price}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d.]/g, '');
                        setEditingProduct(prev => ({ ...prev, price: val === '' ? 0 : parseFloat(val) }));
                      }}
                      placeholder="e.g., 25000"
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
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={editingProduct.stockQuantity}
                      onChange={(e) => setEditingProduct(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label>Product Image</Label>
                    <CustomCloudinaryUpload 
                      onUpload={(url) => setEditingProduct(prev => ({ ...prev, imageUrl: url }))}
                    />
                    {editingProduct.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={editingProduct.imageUrl} 
                          alt="Product preview" 
                          className="w-32 h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="ecoFriendly"
                      checked={editingProduct.ecoFriendly}
                      onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, ecoFriendly: checked }))}
                    />
                    <Label htmlFor="ecoFriendly">Eco-Friendly</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="available"
                      checked={editingProduct.available}
                      onCheckedChange={(checked) => setEditingProduct(prev => ({ ...prev, available: checked }))}
                    />
                    <Label htmlFor="available">Available</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-name">Name *</Label>
              <Input
                id="new-name"
                value={newProduct.name}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Product name"
              />
            </div>
            
            <div>
              <Label htmlFor="new-description">Description *</Label>
              <Textarea
                id="new-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-price">Price *</Label>
                <Input
                  id="new-price"
                  type="text"
                  inputMode="decimal"
                  value={newProduct.price}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d.]/g, '');
                    setNewProduct(prev => ({ ...prev, price: val === '' ? 0 : parseFloat(val) }));
                  }}
                  placeholder="25000"
                />
              </div>
              
              <div>
                <Label htmlFor="new-category">Category *</Label>
                <Input
                  id="new-category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Hair Care"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-stockQuantity">Stock Quantity *</Label>
                <Input
                  id="new-stockQuantity"
                  type="number"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                  placeholder="50"
                />
              </div>
              
              <div>
                <Label>Product Image</Label>
                <CustomCloudinaryUpload 
                  onUpload={(url) => setNewProduct(prev => ({ ...prev, imageUrl: url }))}
                />
                {newProduct.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={newProduct.imageUrl} 
                      alt="Product preview" 
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="new-ecoFriendly"
                  checked={newProduct.ecoFriendly}
                  onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, ecoFriendly: checked }))}
                />
                <Label htmlFor="new-ecoFriendly">Eco-Friendly</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="new-available"
                  checked={newProduct.available}
                  onCheckedChange={(checked) => setNewProduct(prev => ({ ...prev, available: checked }))}
                />
                <Label htmlFor="new-available">Available</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit} disabled={saving}>
              {saving ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManager;
