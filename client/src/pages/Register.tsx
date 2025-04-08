import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Volleyball } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
      });
      return;
    }
    
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez accepter les conditions d'utilisation.",
      });
      return;
    }
    
    await register(name, email, password);
  };

  return (
    <div className="py-12">
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <Volleyball className="text-teal-700 h-10 w-10 mb-2" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
            <p className="text-gray-600">Créez votre compte pour rejoindre le tournoi</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            
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
                autoComplete="new-password"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms} 
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                required
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                J'accepte les{" "}
                <Link href="/terms">
                  <a className="text-teal-700 hover:text-teal-800 font-medium">
                    conditions d'utilisation
                  </a>
                </Link>
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-teal-700 hover:bg-teal-800"
              disabled={isLoading}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Vous avez déjà un compte?{" "}
              <Link href="/login">
                <a className="font-medium text-teal-700 hover:text-teal-800">
                  Connectez-vous
                </a>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
