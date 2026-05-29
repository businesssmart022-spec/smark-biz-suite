import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock, 
  DollarSign, 
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { users, logout, updateUserStatus, toggleUserLock } = useApp();
  const [activeTab, setActiveTab] = useState('sellers');

  const sellers = users.filter(u => u.role === 'SELLER');
  const pendingCount = sellers.filter(s => s.status === 'PENDING').length;
  const totalRevenue = sellers.filter(s => s.subscriptionActive).length * 10;

  const handleApprove = (userId: string) => {
    updateUserStatus(userId, 'APPROVED');
    toast.success('Vendeur approuvé avec succès !');
  };

  const handleReject = (userId: string) => {
    updateUserStatus(userId, 'BLOCKED');
    toast.error('Demande rejetée.');
  };

  const handleToggleLock = (userId: string) => {
    toggleUserLock(userId);
    toast.info('Statut du compte mis à jour.');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-2 mb-2">
             <ShieldCheck className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">SMARK ADMIN</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <AdminNavButton 
            active={activeTab === 'sellers'} 
            onClick={() => setActiveTab('sellers')}
            icon={<Users className="h-4 w-4" />}
            label="Vendeurs"
            badge={pendingCount > 0 ? pendingCount : undefined}
          />
          <AdminNavButton 
            active={activeTab === 'finance'} 
            onClick={() => setActiveTab('finance')}
            icon={<DollarSign className="h-4 w-4" />}
            label="Finances"
          />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-slate-800" onClick={logout}>
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Console d'Administration</h1>
            <p className="text-slate-500">Gérez les vendeurs et surveillez la plateforme.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AdminStatCard label="Total Vendeurs" value={sellers.length} icon={<Users className="text-blue-600" />} />
            <AdminStatCard label="En Attente" value={pendingCount} icon={<AlertTriangle className="text-amber-600" />} />
            <AdminStatCard label="CA Estimé Mensuel" value={`$${totalRevenue}`} icon={<DollarSign className="text-green-600" />} />
          </div>

          {activeTab === 'sellers' && (
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Vendeurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-4 px-4 font-medium">Nom / Entreprise</th>
                        <th className="py-4 px-4 font-medium">Email / Contact</th>
                        <th className="py-4 px-4 font-medium">Statut</th>
                        <th className="py-4 px-4 font-medium">Abonnement</th>
                        <th className="py-4 px-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {sellers.map(seller => (
                        <tr key={seller.id} className={seller.isLocked ? "bg-red-50" : ""}>
                          <td className="py-4 px-4">
                            <div className="font-bold">{seller.fullName}</div>
                            <div className="text-xs text-muted-foreground">{seller.businessName || 'Individuel'}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div>{seller.email}</div>
                            <div className="text-xs text-muted-foreground">{seller.phone}</div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={
                              seller.status === 'APPROVED' ? 'default' : 
                              seller.status === 'PENDING' ? 'secondary' : 'destructive'
                            }>
                              {seller.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1">
                              <span className={seller.subscriptionActive ? "text-green-600" : "text-red-600"}>
                                {seller.subscriptionActive ? 'Payé' : 'Défaut'}
                              </span>
                              {seller.isLocked && <Lock className="h-3 w-3 text-red-600" />}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            {seller.status === 'PENDING' && (
                              <>
                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApprove(seller.id)}>
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleReject(seller.id)}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {seller.status === 'APPROVED' && (
                              <Button 
                                size="sm" 
                                variant={seller.isLocked ? "default" : "outline"}
                                className={seller.isLocked ? "bg-red-600" : "text-red-600 border-red-600"}
                                onClick={() => handleToggleLock(seller.id)}
                              >
                                {seller.isLocked ? <Unlock className="h-4 w-4 mr-1" /> : <Lock className="h-4 w-4 mr-1" />}
                                {seller.isLocked ? "Débloquer" : "Bloquer"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Journal des Paiements</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                      {sellers.filter(s => s.status === 'APPROVED').map(s => (
                        <div key={s.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-100 rounded-full">
                              <DollarSign className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                              <p className="font-bold">{s.fullName}</p>
                              <p className="text-xs text-muted-foreground">Paiement mensuel automatique</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">+$10.00</p>
                            <p className="text-xs text-slate-400">Récurrent</p>
                          </div>
                        </div>
                      ))}
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

const AdminNavButton = ({ active, onClick, icon, label, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      {label}
    </div>
    {badge && (
      <span className="bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const AdminStatCard = ({ label, value, icon }: any) => (
  <Card className="border-none shadow-sm bg-white">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-full">{icon}</div>
    </CardContent>
  </Card>
);

export default AdminDashboard;