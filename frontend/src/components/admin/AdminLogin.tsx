
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import Admin from "@/pages/Admin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLoginProps {
  onLogin: (username: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

const AdminLogin = ({ onLogin, isLoading, error }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.role &&
      ["ADMIN", "SUPER_ADMIN"].includes(user.role)
    ) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md vintage-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 brand-gradient rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">3KS&T Admin Portal</CardTitle>
          <p className="text-muted-foreground">Access your content management system</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full brand-gradient text-white hover-lift"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
