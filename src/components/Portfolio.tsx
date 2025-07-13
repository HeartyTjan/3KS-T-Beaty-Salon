
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const portfolioItems = [
    {
      id: 1,
      title: "Natural Hair Transformation",
      category: "styling",
      beforeImage: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Complete natural hair styling with organic products"
    },
    {
      id: 2,
      title: "Vibrant Color Treatment",
      category: "coloring",
      beforeImage: "https://images.unsplash.com/photo-1595475038665-8b9070e6f91b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Bold color transformation using eco-friendly dyes"
    },
    {
      id: 3,
      title: "Traditional Braids",
      category: "braids",
      beforeImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Beautiful traditional braiding with modern touches"
    },
    {
      id: 4,
      title: "Nail Art Design",
      category: "nails",
      beforeImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterImage: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Intricate nail art with professional finish"
    },
    {
      id: 5,
      title: "Hair Extensions",
      category: "extensions",
      beforeImage: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterImage: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Natural-looking hair extensions for volume and length"
    },
    {
      id: 6,
      title: "Loc Maintenance",
      category: "locs",
      beforeImage: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      afterImage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Professional loc maintenance and styling"
    }
  ];

  const filters = [
    { key: "all", label: "All Work" },
    { key: "styling", label: "Styling" },
    { key: "coloring", label: "Coloring" },
    { key: "braids", label: "Braids" },
    { key: "nails", label: "Nails" },
    { key: "extensions", label: "Extensions" },
    { key: "locs", label: "Locs" }
  ];

  const filteredItems = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Our Portfolio
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Amazing Transformations
            <span className="text-transparent bg-clip-text brand-gradient block">
              Before & After Gallery
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See the incredible transformations we've created for our clients. 
            Each project showcases our commitment to excellence and creativity.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.key)}
              className={activeFilter === filter.key ? "brand-gradient text-white" : ""}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover-lift overflow-hidden bg-card border-border">
              <div className="relative">
                {/* Before/After Image Container */}
                <div className="relative h-64 overflow-hidden group">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 relative overflow-hidden">
                      <img 
                        src={item.beforeImage}
                        alt={`${item.title} - Before`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-red-500 text-white text-xs">Before</Badge>
                      </div>
                    </div>
                    <div className="w-1/2 relative overflow-hidden">
                      <img 
                        src={item.afterImage}
                        alt={`${item.title} - After`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-2 right-2">
                        <Badge className="bg-green-500 text-white text-xs">After</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Divider Line */}
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white transform -translate-x-px"></div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <Badge variant="secondary" className="capitalize">
                  {item.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover-lift">
            View Full Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
