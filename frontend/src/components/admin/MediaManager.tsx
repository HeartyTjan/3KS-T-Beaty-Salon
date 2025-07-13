
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon, Video, Search } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "image" | "video";
  url: string;
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
      url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      category: "Hair Coloring",
      alt: "Hair coloring transformation",
      uploadDate: "2024-01-20",
      size: "2.3 MB"
    },
    {
      id: "2",
      name: "home-service-setup.jpg",
      type: "image",
      url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    url: "",
    category: "",
    alt: "",
    size: ""
  });

  const categories = ["All", "Hair Coloring", "Home Service", "Styling", "Products", "Testimonials", "Portfolio"];

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
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
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        ...formData,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setMediaItems([...mediaItems, newMediaItem]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "image",
      url: "",
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
      url: media.url,
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
              
              <div className="space-y-2">
                <Label htmlFor="url">Media URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  placeholder="https://example.com/media-file.jpg"
                  required
                />
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
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              {media.type === "image" ? (
                <img 
                  src={media.url}
                  alt={media.alt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Video className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute top-2 left-2">
                <Badge className={media.type === "image" ? "bg-blue-500 text-white" : "bg-red-500 text-white"}>
                  {media.type === "image" ? <ImageIcon className="w-3 h-3 mr-1" /> : <Video className="w-3 h-3 mr-1" />}
                  {media.type.toUpperCase()}
                </Badge>
              </div>
              
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">{media.size}</Badge>
              </div>
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
