
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mediaAPI, Media } from "@/lib/api";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mediaAPI.getAllMedia().then((data) => {
      setMediaItems(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filters = [
    { key: "all", label: "All Work" },
    ...Array.from(new Set(mediaItems.map(item => item.category))).map(cat => ({ key: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
  ];

  const filteredItems = activeFilter === "all"
    ? mediaItems
    : mediaItems.filter(item => item.category === activeFilter);

  if (loading) return <div className="text-center py-20">Loading...</div>;

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
                        src={item.beforeUrl}
                        alt={item.alt + ' - Before'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-red-500 text-white text-xs">Before</Badge>
                      </div>
                    </div>
                    <div className="w-1/2 relative overflow-hidden">
                      <img 
                        src={item.afterUrl}
                        alt={item.alt + ' - After'}
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
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{item.alt}</p>
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
