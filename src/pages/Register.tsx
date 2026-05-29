import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, CreditCard } from 'lucide-react';

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    address: '',
    email: '',
    password: '',
    country: '',
    city: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        businessName: formData.businessName,
        address: formData.address,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        city: formData.city,
        phone: formData.phone,
        hasValidCard: true
      });
      toast.success('Compte créé avec succès ! Attendez la validation administrative.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Étape {step}/2</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Devenir Vendeur</CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? "Informations sur votre activité" : "Sécurisation de votre essai gratuit"}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
          <CardContent className="grid gap-4">
            {step === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom Complet *</Label>
                  <Input 
                    id="fullName" 
                    required 
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nom de l'entreprise (facultatif)</Label>
                  <Input 
                    id="businessName" 
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse de résidence *</Label>
                  <Input 
                    id="address" 
                    required 
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays d'origine *</Label>
                  <Input 
                    id="country" 
                    required 
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input 
                    id="city" 
                    required 
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Note :</strong> Pour activer votre mois d'essai gratuit, une carte Visa valide est obligatoire. Aucun prélèvement ne sera effectué avant la fin de l'essai de 30 jours.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card">Numéro de Carte Visa</Label>
                    <div className="relative">
                      <Input 
                        id="card" 
                        placeholder="0000 0000 0000 0000" 
                        required 
                        value={formData.cardNumber}
                        onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="pl-10"
                      />
                      <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">MM/AA</Label>
                      <Input 
                        id="expiry" 
                        placeholder="12/28" 
                        required 
                        value={formData.expiry}
                        onChange={e => setFormData({ ...formData, expiry: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        placeholder="123" 
                        required 
                        value={formData.cvc}
                        onChange={e => setFormData({ ...formData, cvc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {step === 1 ? (
              <Button className="w-full" type="submit">Suivant</Button>
            ) : (
              <div className="flex gap-4 w-full">
                <Button variant="outline" className="flex-1" onClick={handleBack} type="button">Retour</Button>
                <Button className="flex-[2]" type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Finaliser l'inscription
                </Button>
              </div>
            )}
            <div className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;