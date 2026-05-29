import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Store, 
  BarChart3, 
  ShieldCheck, 
  Facebook, 
  Smartphone,
  Globe,
  Zap,
  CheckCircle2,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

const LandingPage = () => {
  const { user } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/d4672546-4074-470f-bdeb-395f0a801a51/logo-63cd2e14-1780053066077.webp" 
              alt="SMARK Logo" 
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-bold text-xl tracking-tight">SMARK BUSINESS</span>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === 'ADMIN' && (
              <Link 
                to="/admin" 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
              >
                <ShieldCheck className="h-4 w-4" />
                Espace Administrateur
              </Link>
            )}
            
            {user?.role === 'SELLER' && (
              <Link 
                to="/seller" 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                Ma Boutique
              </Link>
            )}

            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#0f172a] text-white hover:bg-[#1e293b]">Commencer</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* Mobile version of the admin link if needed, but the request was simple */}
                <span className="text-sm text-muted-foreground hidden sm:inline">Connecté en tant que <span className="font-semibold text-foreground">{user.fullName}</span></span>
                {user.role === 'ADMIN' && (
                   <Link to="/admin" className="md:hidden">
                    <Button size="icon" variant="outline" className="text-red-600 border-red-200">
                      <ShieldCheck className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Propulsez votre <span className="text-blue-600">e-commerce</span> vers le succès
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              SMARK BUSINESS offre à chaque vendeur un espace de vente privé, 100% autonome et optimisé. Gérez vos commandes et boostez votre croissance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      Essai gratuit de 30 jours <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Voir la démo
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to={user.role === 'ADMIN' ? "/admin" : "/seller"}>
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Aller à mon espace <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-16 rounded-2xl overflow-hidden shadow-2xl border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/d4672546-4074-470f-bdeb-395f0a801a51/hero-banner-06fb1813-1780053066238.webp" 
              alt="Dashboard Preview" 
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Fonctionnalités Clés</h2>
            <p className="text-muted-foreground">Tout ce dont vous avez besoin pour réussir en ligne.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Store className="h-8 w-8 text-blue-600" />}
              title="Boutique Privée"
              description="Chaque vendeur bénéficie d'une boutique personnalisée et d'un outil de gestion complet."
            />
            <FeatureCard 
              icon={<Facebook className="h-8 w-8 text-blue-600" />}
              title="Facebook Ads Ready"
              description="Synchronisation directe avec Facebook pour faciliter vos campagnes publicitaires."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
              title="Analyses Précises"
              description="Suivez votre chiffre d'affaires, vos visites et vos produits phares en temps réel."
            />
            <FeatureCard 
              icon={<Smartphone className="h-8 w-8 text-blue-600" />}
              title="Mobile First"
              description="Gérez votre business n'importe où, n'importe quand depuis votre smartphone."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-blue-600" />}
              title="Paiements Sécurisés"
              description="Intégration Stripe et Flutterwave pour des transactions sans risque."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-blue-600" />}
              title="Mise en route rapide"
              description="Inscrivez-vous et commencez à vendre en moins de 5 minutes."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Un tarif simple et transparent</h2>
            <p className="text-muted-foreground">Pas de frais cachés, pas de commission sur vos ventes.</p>
          </div>
          
          <Card className="relative overflow-hidden border-2 border-blue-600">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
              Populaire
            </div>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Abonnement Mensuel</h3>
              <div className="flex items-baseline justify-center gap-1 mb-6">
                <span className="text-5xl font-extrabold">$10</span>
                <span className="text-muted-foreground">/ mois</span>
              </div>
              
              <ul className="space-y-4 mb-8 text-left max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>1 mois d'essai GRATUIT</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Boutique illimitée</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Support prioritaire 24/7</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Sync Facebook Ads</span>
                </li>
              </ul>
              
              {!user ? (
                <Link to="/register">
                  <Button className="w-full py-6 text-lg">Démarrer mon essai gratuit</Button>
                </Link>
              ) : (
                <Link to={user.role === 'ADMIN' ? "/admin" : "/seller"}>
                  <Button className="w-full py-6 text-lg">Accéder à mon espace</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/d4672546-4074-470f-bdeb-395f0a801a51/logo-63cd2e14-1780053066077.webp" 
              alt="Logo" 
              className="h-6 w-6 rounded-full"
            />
            <span className="font-bold">SMARK BUSINESS</span>
          </div>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Votre partenaire croissance au quotidien pour la réussite de votre boutique en ligne.
          </p>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SMARK BUSINESS. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

export default LandingPage;