import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  LogOut, 
  Plus, 
  Trash2, 
  ExternalLink,
  Facebook,
  Menu,
  X,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const SellerDashboard = () => {
  const { user, products, orders, logout, addProduct, updateProduct, deleteProduct, getSellerStats } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const stats = getSellerStats(user?.id || '');
  const sellerProducts = products.filter(p => p.sellerId === user?.id);
  const sellerOrders = orders.filter(o => o.sellerId === user?.id);

  const tabs = [
    { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'products', label: "Produits", icon: Package },
    { id: 'orders', label: "Commandes", icon: ShoppingCart },
    { id: 'billing', label: "Abonnement", icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-2">
             <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/d4672546-4074-470f-bdeb-395f0a801a51/logo-63cd2e14-1780053066077.webp" 
              alt="Logo" 
              className="h-6 w-6 rounded-full"
            />
            <span className="font-bold">SMARK BUSINESS</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground truncate">{user?.fullName}</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden flex flex-col w-full">
        <header className="h-16 bg-white border-b px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/d4672546-4074-470f-bdeb-395f0a801a51/logo-63cd2e14-1780053066077.webp" 
              alt="Logo" 
              className="h-6 w-6 rounded-full"
            />
            <span className="font-bold">SMARK</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>
        {isMobileMenuOpen && (
          <nav className="bg-white border-b p-4 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 font-medium" onClick={logout}>
              <LogOut className="h-5 w-5" /> Déconnexion
            </button>
          </nav>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold">Bonjour, {user?.fullName} 👋</h1>
                <p className="text-muted-foreground">Voici les performances de votre boutique aujourd'hui.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard label="Chiffre d'Affaires" value={`$${stats.revenue}`} icon={<TrendingUp className="text-green-600" />} />
                <StatCard label="Visiteurs" value={stats.visits} icon={<ExternalLink className="text-blue-600" />} />
                <StatCard label="Commandes" value={stats.salesCount} icon={<ShoppingCart className="text-purple-600" />} />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ventes Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sellerOrders.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">Aucune commande pour le moment.</p>
                    ) : (
                      sellerOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">{order.productName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${order.amount}</p>
                            <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>{order.status}</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
             <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold">Mes Produits</h2>
                 <AddProductDialog onAdd={addProduct} />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {sellerProducts.map(product => (
                   <Card key={product.id} className="overflow-hidden">
                     <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
                     <CardContent className="p-4">
                       <div className="flex justify-between items-start mb-2">
                         <h3 className="font-bold">{product.name}</h3>
                         <span className="text-blue-600 font-bold">${product.price}</span>
                       </div>
                       <div className="flex items-center justify-between mt-4">
                         <div className="flex items-center gap-2">
                            <Switch 
                              checked={product.syncedToFacebook} 
                              onCheckedChange={(checked) => updateProduct(product.id, { syncedToFacebook: checked })}
                            />
                            <Label className="text-xs flex items-center gap-1"><Facebook className="h-3 w-3" /> Sync FB</Label>
                         </div>
                         <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => deleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </div>
          )}

          {activeTab === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-4 font-medium">Client</th>
                        <th className="py-4 font-medium">Produit</th>
                        <th className="py-4 font-medium">Prix</th>
                        <th className="py-4 font-medium">Statut</th>
                        <th className="py-4 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {sellerOrders.map(order => (
                        <tr key={order.id}>
                          <td className="py-4">{order.customerName}</td>
                          <td className="py-4">{order.productName}</td>
                          <td className="py-4 font-bold">${order.amount}</td>
                          <td className="py-4">
                            <Badge>{order.status}</Badge>
                          </td>
                          <td className="py-4 text-muted-foreground">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'billing' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-xl font-bold">Mon Abonnement</h2>
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-lg">Période d'Essai Gratuite</h3>
                      <p className="text-sm text-blue-700">Expire le {new Date(new Date(user?.trialStartDate || '').getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-blue-600">Actif</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">Votre abonnement de **$10/mois** débutera automatiquement après la période d'essai.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Méthode de Paiement</CardTitle>
                  <CardDescription>La carte utilisée pour vos prélèvements automatiques.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                    <div className="h-10 w-12 bg-white border rounded flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Visa se terminant par •••• 4242</p>
                      <p className="text-xs text-muted-foreground">Expire le 12/28</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto">Modifier</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
  <Card>
    <CardContent className="p-6 flex items-center gap-4">
      <div className="p-3 bg-slate-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const AddProductDialog = ({ onAdd }: { onAdd: any }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [sync, setSync] = useState(false);

  const handleSubmit = () => {
    if (!name || !price) return toast.error('Remplissez tous les champs obligatoires');
    onAdd({
      name,
      price: parseFloat(price),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      syncedToFacebook: sync,
      stock: 100
    });
    toast.success('Produit ajouté !');
    setName(''); setPrice(''); setImage(''); setSync(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Nouveau Produit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nom du produit</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="ex: Smart Watch" />
          </div>
          <div className="space-y-2">
            <Label>Prix ($)</Label>
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
          </div>
          <div className="space-y-2">
            <Label>URL de l'image (optionnel)</Label>
            <Input value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Switch checked={sync} onCheckedChange={setSync} />
            <Label>Synchroniser avec Facebook Ads</Label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Enregistrer le produit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SellerDashboard;