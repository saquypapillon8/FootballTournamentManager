import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Volleyball } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading } = useAuth();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    await login(email, password);
  };

  return (
    <div className="py-12">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="65" height="65" viewBox="0 0 1500 1500" className="text-black mb-2">
                <path className="fill-current" d="M1096.01,674.38c-6.6-19.1-15.67-36.92-26.76-53.03-24.78-35.95-59.75-63.43-100.35-77.52-.35-.15-.72-.27-1.06-.37h-462.18c-26.84,0-51.87,13.49-66.62,35.9l-62.52,95.01-49.05,74.53-48.53-74.53-85.27-130.91H24.96v389.07c0,13.26,10.75,24.01,24.01,24.01h111.26v-219.62l51.62,84.71,82.19,134.92h67.63l82.65-134.92,51.89-84.71v219.62h461.77c3.7,0,7.39-.56,10.88-1.81.02,0,.04-.01.06-.02,40.6-14.08,75.56-41.56,100.35-77.52,11.59-16.83,20.95-35.51,27.63-55.57,7.54-22.61,11.64-46.97,11.64-72.35s-4.42-51.57-12.5-74.9ZM968.91,765.43c0,31.04-25.15,56.19-56.19,56.19h-145.99v-147.25h145.99c31.04,0,56.19,25.15,56.19,56.19v34.87Z"/>
                <path className="fill-current" d="M1069.25,899.58c20.24-21.92,36.1-48.46,46.11-77.96,7.81-22.98,12.06-47.79,12.06-73.64s-4.25-50.63-12.06-73.61c-10.01-29.53-25.87-56.04-46.11-77.96v-52.95h405.79v107.64h-271.98v46.53h271.98v98.91h-271.98v50.19h271.98v109.81h-348.83c-31.46,0-56.96-25.5-56.96-56.96h0Z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
            <p className="text-gray-600">Accédez à votre compte pour gérer votre équipe</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember_me" 
                  checked={rememberMe} 
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember_me" className="text-sm font-normal">Se souvenir de moi</Label>
              </div>
              
              <span
                className="text-sm font-medium text-teal-700 hover:text-teal-800 cursor-pointer"
                onClick={() => navigate("/forgot-password")}
              >
                Mot de passe oublié?
              </span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-teal-700 hover:bg-teal-800"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>

            <div className="mt-3">
              <Button 
                type="button" 
                className="w-full bg-indigo-700 hover:bg-indigo-800"
                variant="outline"
                onClick={() => navigate("/admin")}
              >
                Accès Administrateur
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                Vous n'avez pas de compte?{" "}
                <span 
                  className="font-medium text-teal-700 hover:text-teal-800 cursor-pointer"
                  onClick={() => navigate("/register")}
                >
                  Inscrivez-vous
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
