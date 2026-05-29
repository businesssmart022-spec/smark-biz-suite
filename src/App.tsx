import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from './components/ui/sonner';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { SidebarProvider } from './components/ui/sidebar';

const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: 'ADMIN' | 'SELLER' }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/seller/*" 
        element={
          <PrivateRoute role="SELLER">
            <SidebarProvider>
              <SellerDashboard />
            </SidebarProvider>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin/*" 
        element={
          <PrivateRoute role="ADMIN">
             <SidebarProvider>
              <AdminDashboard />
            </SidebarProvider>
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background font-sans antialiased">
          <AppRoutes />
          <Toaster position="top-center" />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;