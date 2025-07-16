
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Video, Search } from "lucide-react";
import { useRef } from "react";
import { mediaAPI, Media } from "@/lib/api";
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  beforeUrl: string;
  afterUrl: string;
  category: string;
  alt: string;
  uploadDate: string;
  size: string;
}

const MediaManager = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "1",
      name: "hair-coloring-before-after.jpg",
      type: "image",
      beforeUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Hair Coloring",
      alt: "Hair coloring transformation",
      uploadDate: "2024-01-20",
      size: "2.3 MB"
    },
    {
      id: "2",
      name: "home-service-setup.jpg",
      type: "image",
      beforeUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Home Service",
      alt: "Professional home service setup",
      uploadDate: "2024-01-18",
      size: "1.8 MB"
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formData, setFormData] = useState({
    name: "",
    type: "image" as "image" | "video",
    beforeUrl: "",
    afterUrl: "",
    category: "",
    alt: "",
    size: ""
  });

  const categories = ["All", "Hair Coloring", "Home Service", "Styling", "Products", "Testimonials", "Portfolio"];

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const { toast } = useToast();

  useEffect(() => {
    mediaAPI.getAllMedia().then(setMediaItems);
  }, []);

  function CloudinaryMediaUpload({ onUpload, type }) {
    const inputRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleFileChange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setProgress(0);
      setUploading(true);
      setError("");
      setSuccess("");
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
            onUpload(data.secure_url, file);
            setSuccess("Upload successful!");
            setError("");
          } else {
            setError("Upload failed");
            setSuccess("");
          }
        } else {
          setUploading(false);
          setError("Upload failed");
          setSuccess("");
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setError("Upload failed");
        setSuccess("");
      };
      xhr.send(formData);
    };

    return (
      <div>
        <input
          type="file"
          accept={type === "video" ? "video/*" : "image/*,video/*"}
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Pick Image/Video'}
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

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMedia) {
      setMediaItems(mediaItems.map(item => 
        item.id === editingMedia.id 
          ? { 
              ...item, 
              ...formData,
              uploadDate: editingMedia.uploadDate
            }
          : item
      ));
    } else {
      try {
        // Ensure type is uppercase for backend enum
        const payload = { ...formData, type: formData.type.toUpperCase() };
        await mediaAPI.createMedia(payload);
        const updated = await mediaAPI.getAllMedia();
        setMediaItems(updated);
        toast({ title: 'Media uploaded successfully!', status: 'success' });
      } catch (err) {
        toast({ title: 'Failed to upload media', status: 'error' });
      }
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "image",
      beforeUrl: "",
      afterUrl: "",
      category: "",
      alt: "",
      size: ""
    });
    setEditingMedia(null);
    setIsFormOpen(false);
  };

  const handleEdit = (media: MediaItem) => {
    setFormData({
      name: media.name,
      type: media.type,
      beforeUrl: media.beforeUrl,
      afterUrl: media.afterUrl,
      category: media.category,
      alt: media.alt,
      size: media.size
    });
    setEditingMedia(media);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Media Management</h2>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="brand-gradient text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Media
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Media Upload Form */}
      {isFormOpen && (
        <Card className="vintage-shadow">
          <CardHeader>
            <CardTitle>{editingMedia ? "Edit Media" : "Upload New Media"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">File Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., hair-transformation.jpg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Media Type</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as "image" | "video"})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              
              {/* Before/After Uploaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Before Image</Label>
                  <CloudinaryMediaUpload 
                    onUpload={(url, file) => {
                      setFormData(prev => ({
                        ...prev,
                        beforeUrl: url,
                        size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : prev.size
                      }));
                    }}
                    type="image"
                  />
                  {formData.beforeUrl && (
                    <div className="mt-2">
                      <img src={formData.beforeUrl} alt="Before preview" className="w-32 h-32 object-contain rounded border" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>After Image</Label>
                  <CloudinaryMediaUpload 
                    onUpload={(url, file) => {
                      setFormData(prev => ({
                        ...prev,
                        afterUrl: url,
                        size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : prev.size
                      }));
                    }}
                    type="image"
                  />
                  {formData.afterUrl && (
                    <div className="mt-2">
                      <img src={formData.afterUrl} alt="After preview" className="w-32 h-32 object-contain rounded border" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">File Size</Label>
                  <Input
                    id="size"
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    placeholder="e.g., 2.3 MB"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="alt">Alt Text / Description</Label>
                <Input
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({...formData, alt: e.target.value})}
                  placeholder="Describe the image for accessibility"
                  required
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="brand-gradient text-white">
                  {editingMedia ? "Update Media" : "Upload Media"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map((media) => (
          <Card key={media.id} className="hover-lift">
            <div className="relative h-64 overflow-hidden group">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 relative overflow-hidden">
                  <img 
                    src={media.beforeUrl}
                    alt={media.alt + ' - Before'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-red-500 text-white text-xs">Before</Badge>
                  </div>
                </div>
                <div className="w-1/2 relative overflow-hidden">
                  <img 
                    src={media.afterUrl}
                    alt={media.alt + ' - After'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-green-500 text-white text-xs">After</Badge>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white transform -translate-x-px"></div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-1 truncate">{media.name}</h4>
              <p className="text-xs text-muted-foreground mb-2 truncate">{media.alt}</p>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs">{media.category}</Badge>
                <span className="text-xs text-muted-foreground">{media.uploadDate}</span>
              </div>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleEdit(media)}
                  className="flex items-center gap-1 flex-1 text-xs"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(media.id)}
                  className="flex items-center gap-1 text-destructive hover:text-destructive text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No media found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== "All" 
              ? "Try adjusting your search or filter criteria"
              : "Upload your first media file to get started"
            }
          </p>
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="brand-gradient text-white"
          >
            Upload Media
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaManager;
