import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { serviceAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  image?: string; // Added image field
  active?: boolean;
  imageUrl?: string; // Added imageUrl field
  name?: string; // Backend field
  available?: boolean; // Backend field
  createdAt?: string;
  updatedAt?: string;
}

const ServiceManager = () => {
  const [services, setServices] = useState<Service[]>([]);


  useEffect(() => {
    serviceAPI.getAllServices().then(res => {
      setServices((res || []).map(s => ({
        ...s,
        title: s.name || s.title, // Map backend 'name' to frontend 'title'
        active: s.available !== undefined ? s.available : (s.active ?? true), // Map backend 'available' to frontend 'active'
        features: s.features || [],
        price: s.price?.toString() || '', // Ensure price is string
        duration: s.duration || ''
      })));
      console.log("res",res.data?.[4])
    });
  

  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service>({
    id: "",
    title: "",
    description: "",
    price: "",
    duration: "",
    features: [],
    active: true,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState<Service>({
    id: "",
    title: "",
    description: "",
    price: "",
    duration: "",
    features: [],
    image: "",
    active: true,
  });

  const [saving, setSaving] = useState(false);

  // Validation functions
  const validateService = (service: Partial<Service>) => {
    const errors: string[] = [];
    
    if (!service.title || service.title.trim().length < 2) {
      errors.push('Title must be at least 2 characters long');
    }
    
    if (!service.description || service.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
    
    if (!service.duration || service.duration.trim().length === 0) {
      errors.push('Duration is required');
    }
    
    if (!service.features || service.features.length === 0) {
      errors.push('At least one feature is required');
    }
    
    if (service.price && service.price.trim() !== '') {
      const priceValue = parseFloat(service.price.replace(/[^\d.]/g, ''));
      if (isNaN(priceValue) || priceValue < 0) {
        errors.push('Price must be a valid positive number');
      }
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

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setEditingService({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      duration: service.duration,
      features: service.features,
      active: service.active ?? true, 
    });
  };

  const handleSave = async () => {
    if (editingId) {
      // Validate the service before saving
      const validationErrors = validateService(editingService);
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => toast.error(error));
        return;
      }

      setEditingId(null); // Exit edit mode immediately

      const { id, image, imageUrl, ...payload } = editingService;
      const finalPayload = {
        ...payload,
        price: editingService.price ? Number(editingService.price) : undefined,
      };

      console.log("newService active", editingService.active);

      // Only include imageUrl if a new image is provided, otherwise keep the old one
      if (editingService.image && editingService.image.trim() !== "") {
        finalPayload.imageUrl = editingService.image;
      } else if (imageUrl && imageUrl.trim() !== "") {
        finalPayload.imageUrl = imageUrl;
      }

      await serviceAPI.updateService(editingId, finalPayload);
      
      toast.success('Service updated successfully!');

      // Reset editing state
      setEditingService({
        id: "",
        title: "",
        description: "",
        price: "",
        duration: "",
        features: [],
        active: true,
      });

      // Refresh data from backend
      serviceAPI.getAllServices().then(res => {
        setServices((res || []).map(s => ({
          ...s,
          title: s.name || s.title, // Map backend 'name' to frontend 'title'
          active: s.available !== undefined ? s.available : (s.active ?? true), // Map backend 'available' to frontend 'active'
          features: s.features || [],
          price: s.price?.toString() || '', // Ensure price is string
          duration: s.duration || ''
        })));
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingService({
      id: "",
      title: "",
      description: "",
      price: "",
      duration: "",
      features: [],
      active: true,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await serviceAPI.deleteService(id);
      toast.success('Service deleted successfully!');
      // Refresh the services list
      serviceAPI.getAllServices().then(res => {
        setServices((res || []).map(s => ({
          ...s,
          title: s.name || s.title, // Map backend 'name' to frontend 'title'
          active: s.available !== undefined ? s.available : (s.active ?? true), // Map backend 'available' to frontend 'active'
          features: s.features || [],
          price: s.price?.toString() || '', // Ensure price is string
          duration: s.duration || ''
        })));
      });
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  const handleAddService = () => {
    setNewService({ id: "", title: "", description: "", price: "", duration: "", features: [], image: "", active: true });
    setShowAddModal(true);
  };

  const handleAddSubmit = async () => {
    // Validate the service before creating
    const validationErrors = validateService(newService);
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setSaving(true);
    try {
      const { id, image, ...payload } = newService; // Remove id and image
      const finalPayload = { ...payload, price: newService.price ? Number(newService.price) : undefined };
      if (newService.image) finalPayload.imageUrl = newService.image;
      await serviceAPI.createService(finalPayload);
      toast.success('Service created successfully!');
      
      // Refresh the services list instead of optimistic update
      serviceAPI.getAllServices().then(res => {
        setServices((res || []).map(s => ({
          ...s,
          title: s.name || s.title, // Map backend 'name' to frontend 'title'
          active: s.available !== undefined ? s.available : (s.active ?? true), // Map backend 'available' to frontend 'active'
          features: s.features || [],
          price: s.price?.toString() || '', // Ensure price is string
          duration: s.duration || ''
        })));
      });
      
      setShowAddModal(false);
      setNewService({ id: "", title: "", description: "", price: "", duration: "", features: [], image: "", active: true });
    } catch (err) {
      toast.error('Failed to create service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Management</h2>
        <Button className="brand-gradient text-white" onClick={handleAddService}>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover-lift">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {(service.features || []).join(", ")}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {editingId === service.id ? (
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
                      <Button size="sm" variant="outline" onClick={() => handleEdit(service)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingId === service.id ? (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={editingService.title}
                      onChange={(e) => setEditingService(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter service title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={editingService.description}
                      onChange={(e) => setEditingService(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter service description (minimum 10 characters)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (optional)</Label>
                    <Input
                      id="price"
                      value={editingService.price}
                      onChange={(e) => setEditingService(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g., From ₦50,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <Input
                      id="duration"
                      value={editingService.duration}
                      onChange={(e) => setEditingService(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                  <div>
                    <Label htmlFor="features">Features * (comma separated)</Label>
                    <Input
                      id="features"
                      value={(editingService.features || []).join(", ")}
                      onChange={e => setEditingService(prev => ({ ...prev, features: e.target.value.split(",").map(f => f.trim()).filter(Boolean) }))}
                      placeholder="e.g. Personalized consultation, Latest trends, Precision cutting"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="active-switch">Active</Label>
                    <Switch
                      id="active-switch"
                      checked={!!editingService.active}
                      onCheckedChange={checked => setEditingService(prev => ({ ...prev, active: checked }))}
                    />
                    <span className="text-sm text-muted-foreground">{editingService.active ? "Visible" : "Hidden"}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="object-cover w-full h-32 rounded-t-lg"
                    />
                  )}
                  <p className="text-muted-foreground">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">{service.price}</span>
                    <span className="text-sm text-muted-foreground">{service.duration}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Service Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="add-title">Title</Label>
              <Input
                id="add-title"
                value={newService.title}
                onChange={e => setNewService(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="add-description">Description</Label>
              <Textarea
                id="add-description"
                value={newService.description}
                onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="add-price">Price (optional)</Label>
              <Input
                id="add-price"
                value={newService.price}
                onChange={e => setNewService(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., From ₦50,000"
              />
            </div>
            <div>
              <Label htmlFor="add-duration">Duration</Label>
              <Input
                id="add-duration"
                value={newService.duration}
                onChange={e => setNewService(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="add-features">Features (comma separated)</Label>
              <Input
                id="add-features"
                value={(newService.features || []).join(", ")}
                onChange={e => setNewService(prev => ({ ...prev, features: e.target.value.split(",").map(f => f.trim()).filter(Boolean) }))}
                placeholder="e.g. Personalized consultation, Latest trends, Precision cutting"
              />
            </div>
            <div>
              <Label htmlFor="add-image">Service Image/Video</Label>
              <div className="flex items-center gap-2">
                <CustomCloudinaryUpload onUpload={url => setNewService(prev => ({ ...prev, image: url }))} />
                {newService.image && (
                  newService.image.match(/\.(mp4|webm|ogg)$/i)
                    ? <video src={newService.image} controls className="h-32 rounded shadow" />
                    : <img src={newService.image} alt="Preview" className="h-32 rounded shadow" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="add-active-switch">Active</Label>
              <Switch
                id="add-active-switch"
                checked={!!newService.active}
                onCheckedChange={checked => setNewService(prev => ({ ...prev, active: checked }))}
              />
              <span className="text-sm text-muted-foreground">{newService.active ? "Visible" : "Hidden"}</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddSubmit} className="brand-gradient text-white" disabled={saving}>
              {saving ? 'Saving...' : 'Add Service'}
            </Button>
            <Button variant="outline" onClick={() => setShowAddModal(false)} disabled={saving}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManager;
