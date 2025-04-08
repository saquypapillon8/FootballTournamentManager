import { useState } from "react";
import { Link } from "wouter";
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
              <Volleyball className="text-teal-700 h-10 w-10 mb-2" />
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
              
              <Link href="/forgot-password">
                <a className="text-sm font-medium text-teal-700 hover:text-teal-800">
                  Mot de passe oublié?
                </a>
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-teal-700 hover:bg-teal-800"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>

            <div className="mt-3">
              <Link href="/admin">
                <Button 
                  type="button" 
                  className="w-full bg-indigo-700 hover:bg-indigo-800"
                  variant="outline"
                >
                  Accès Administrateur
                </Button>
              </Link>
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
                <Link href="/register">
                  <span className="font-medium text-teal-700 hover:text-teal-800">
                    Inscrivez-vous
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
